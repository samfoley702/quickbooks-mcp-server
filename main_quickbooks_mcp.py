from mcp import types
from mcp.server.fastmcp import FastMCP
from quickbooks_interaction import QuickBooksSession
from api_importer import load_apis
import sys
import json
from pathlib import Path
from typing import Union

# Initialize QuickBooks session with error handling
quickbooks = None
try:
    quickbooks = QuickBooksSession()
    print("✓ QuickBooks session initialized successfully", file=sys.stderr)
except Exception as e:
    print(f"✗ Failed to initialize QuickBooks session: {e}", file=sys.stderr)
    print("Please check your .env file and QuickBooks credentials", file=sys.stderr)

mcp = FastMCP("quickbooks")

@mcp.tool()
def get_quickbooks_entity_schema(entity_name: str) -> types.TextContent:
    """
    Fetches the schema for a given QuickBooks entity (e.g., 'Bill', 'Customer').
    Use this tool to understand the available fields for an entity before constructing a query with the `query_quickbooks` tool.
    """
    schema_path = Path(__file__).parent / 'quickbooks_entity_schemas.json'
    try:
        with open(schema_path, 'r') as f:
            all_schemas = json.load(f)
        
        entity_schema = all_schemas.get(entity_name)
        
        if entity_schema:
            return types.TextContent(type='text', text=json.dumps(entity_schema, indent=2))
        else:
            available_entities = list(all_schemas.keys())
            return types.TextContent(type='text', text=f"Error: Schema not found for entity '{entity_name}'. Available entities: {available_entities}")
    except FileNotFoundError:
        return types.TextContent(type='text', text="Error: The schema definition file `quickbooks_entity_schemas.json` was not found.")
    except Exception as e:
        return types.TextContent(type='text', text=f"An error occurred: {e}")

@mcp.tool()
def query_quickbooks(query: str) -> types.TextContent:
    """
    Executes a SQL-like query on a QuickBooks entity.
    **IMPORTANT**: Before using this tool, you MUST first use the `get_quickbooks_entity_schema` tool to get the schema for the entity you want to query (e.g., 'Bill', 'Customer'). This will show you the available fields to use in your query's `select` and `where` clauses.
    """
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized. Please check your credentials and restart the server.")
    
    try:
        response = quickbooks.query(query)
        return types.TextContent(type='text', text=str(response))
    except Exception as e:
        return types.TextContent(type='text', text=f"Error executing query: {e}")

# ── Write Tools ──────────────────────────────────────────────────────────────

@mcp.tool()
def update_entity(entity_type: str, entity_data: Union[str, dict]) -> types.TextContent:
    """
    Updates an existing QuickBooks entity using a sparse update (only sends changed fields).
    Use this to deactivate accounts, update vendor info, modify customers, etc.

    Parameters:
    - entity_type: The QuickBooks entity type (e.g., 'Account', 'Vendor', 'Customer', 'Invoice', 'Purchase')
    - entity_data: A JSON string with the fields to update. MUST include 'Id' and 'SyncToken'.
      Set 'sparse': true to only update specified fields.

    Examples:
    - Deactivate an account: entity_data='{"Id": "138", "SyncToken": "0", "sparse": true, "Active": false}'
    - Deactivate a vendor: entity_data='{"Id": "71", "SyncToken": "0", "sparse": true, "Active": false}'
    - Update customer name: entity_data='{"Id": "5", "SyncToken": "0", "sparse": true, "DisplayName": "Acme Corp"}'

    IMPORTANT: Always query the entity first to get the current SyncToken before updating.
    """
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized.")

    if isinstance(entity_data, dict):
        data = entity_data
    else:
        try:
            data = json.loads(entity_data)
        except json.JSONDecodeError as e:
            return types.TextContent(type='text', text=f"Error: Invalid JSON in entity_data: {e}")

    entity_lower = entity_type.lower()
    route = f"/{entity_lower}"

    print(f"Updating {entity_type} with data: {data}", file=sys.stderr)

    try:
        response = quickbooks.call_route(method_type='post', route=route, body=data)
        return types.TextContent(type='text', text=json.dumps(response, indent=2) if isinstance(response, dict) else str(response))
    except Exception as e:
        return types.TextContent(type='text', text=f"Error updating {entity_type}: {e}")


@mcp.tool()
def create_entity(entity_type: str, entity_data: Union[str, dict]) -> types.TextContent:
    """
    Creates a new QuickBooks entity (Invoice, Purchase, JournalEntry, Vendor, Customer, etc.).

    Parameters:
    - entity_type: The QuickBooks entity type (e.g., 'Invoice', 'Purchase', 'JournalEntry', 'Vendor', 'Customer')
    - entity_data: A JSON string with the entity fields.

    Examples:
    - Create invoice: entity_data='{"CustomerRef": {"value": "1"}, "Line": [{"Amount": 5000, "DetailType": "SalesItemLineDetail", "SalesItemLineDetail": {"ItemRef": {"value": "1"}}}]}'
    - Create purchase: entity_data='{"AccountRef": {"value": "140"}, "PaymentType": "Cash", "Line": [{"Amount": 100, "DetailType": "AccountBasedExpenseLineDetail", "AccountBasedExpenseLineDetail": {"AccountRef": {"value": "7100"}}}]}'
    - Create vendor: entity_data='{"DisplayName": "New Vendor Inc"}'

    IMPORTANT: Use get_quickbooks_entity_schema first to understand the required fields for the entity type.
    """
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized.")

    if isinstance(entity_data, dict):
        data = entity_data
    else:
        try:
            data = json.loads(entity_data)
        except json.JSONDecodeError as e:
            return types.TextContent(type='text', text=f"Error: Invalid JSON in entity_data: {e}")

    entity_lower = entity_type.lower()
    route = f"/{entity_lower}"

    print(f"Creating {entity_type} with data: {data}", file=sys.stderr)

    try:
        response = quickbooks.call_route(method_type='post', route=route, body=data)
        return types.TextContent(type='text', text=json.dumps(response, indent=2) if isinstance(response, dict) else str(response))
    except Exception as e:
        return types.TextContent(type='text', text=f"Error creating {entity_type}: {e}")


@mcp.tool()
def delete_entity(entity_type: str, entity_id: str, sync_token: str) -> types.TextContent:
    """
    Deletes a QuickBooks entity. Only certain entity types support deletion (e.g., Purchase, Invoice, Bill, Payment, JournalEntry).
    Accounts, Vendors, and Customers cannot be deleted — use update_entity to deactivate them instead.

    Parameters:
    - entity_type: The QuickBooks entity type (e.g., 'Purchase', 'Invoice', 'Bill', 'Payment', 'JournalEntry')
    - entity_id: The Id of the entity to delete
    - sync_token: The current SyncToken of the entity (query the entity first to get this)

    IMPORTANT: This action is PERMANENT and cannot be undone. Always confirm before deleting.
    """
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized.")

    entity_lower = entity_type.lower()
    route = f"/{entity_lower}"
    body = {"Id": entity_id, "SyncToken": sync_token}

    print(f"Deleting {entity_type} Id={entity_id} SyncToken={sync_token}", file=sys.stderr)

    try:
        response = quickbooks.call_route(method_type='post', route=route, params={"operation": "delete"}, body=body)
        return types.TextContent(type='text', text=json.dumps(response, indent=2) if isinstance(response, dict) else str(response))
    except Exception as e:
        return types.TextContent(type='text', text=f"Error deleting {entity_type}: {e}")


@mcp.tool()
def batch_operation(operations: Union[str, dict]) -> types.TextContent:
    """
    Executes multiple QuickBooks operations in a single API call using the batch endpoint.
    Useful for bulk updates like deactivating many accounts at once.

    Parameters:
    - operations: A JSON string containing a list of batch operations.
      Each operation needs: 'bId' (unique batch id), 'operation' (create/update/delete/query), and entity data.

    Example - deactivate multiple accounts:
    operations='{"BatchItemRequest": [
      {"bId": "1", "operation": "update", "Account": {"Id": "138", "SyncToken": "0", "sparse": true, "Active": false}},
      {"bId": "2", "operation": "update", "Account": {"Id": "137", "SyncToken": "0", "sparse": true, "Active": false}}
    ]}'

    Example - delete multiple purchases:
    operations='{"BatchItemRequest": [
      {"bId": "1", "operation": "delete", "Purchase": {"Id": "6", "SyncToken": "0"}},
      {"bId": "2", "operation": "delete", "Purchase": {"Id": "4", "SyncToken": "1"}}
    ]}'

    IMPORTANT: Maximum 30 operations per batch. Each entity must include its current SyncToken.
    """
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized.")

    if isinstance(operations, dict):
        data = operations
    else:
        try:
            data = json.loads(operations)
        except json.JSONDecodeError as e:
            return types.TextContent(type='text', text=f"Error: Invalid JSON in operations: {e}")

    print(f"Executing batch with {len(data.get('BatchItemRequest', []))} operations", file=sys.stderr)

    try:
        response = quickbooks.call_route(method_type='post', route='/batch', body=data)
        return types.TextContent(type='text', text=json.dumps(response, indent=2) if isinstance(response, dict) else str(response))
    except Exception as e:
        return types.TextContent(type='text', text=f"Error executing batch: {e}")


# ── Dynamic Read API Registration ────────────────────────────────────────────

def register_all_apis():
    apis = load_apis()
    for api in apis:
        response_description = api["response_description"]

        # Clean up the route and remove the company/realm part
        original_route = api['route']
        if '/v3/company/{realmId}' in original_route:
            clean_api_route = original_route.replace('/v3/company/{realmId}', '')
        else:
            clean_api_route = original_route

        clean_route_for_name = (clean_api_route.replace('/', '_').replace('-', '_').replace(':', '_')
                               .replace('{', '').replace('}', ''))

        method_name = f'{api["method"]}{clean_route_for_name}'
        clean_summary = api["summary"]
        if clean_summary is None:
            words = method_name.split('_')
            words[0] = words[0].capitalize()
            clean_summary = ' '.join(words) + '. '

        doc = clean_summary + '. '
        if response_description != "OK":
            doc += f'If successful, the outcome will be \"{api["response_description"]}\". '
        
        # Combine request_data and parameters for the docstring
        all_params = {}
        api_params_filtered = [p for p in api.get('parameters', []) if p['name'] != 'realmId']

        if api_params_filtered:
            for p in api_params_filtered:
                all_params[p['name']] = {
                    'description': p.get('description', 'No description provided'),
                    'required': p.get('required', False),
                    'type': p.get('type', 'unknown'),
                    'in': p.get('location')
                }
        
        if api.get('request_data'):
            doc += f'The request body should be a JSON object with the following structure: {json.dumps(api["request_data"])}. '

        if all_params:
            doc += f'Parameters: {json.dumps(all_params, indent=2)}. '

        # Create a more structured tool function definition
        method_str = f"""
@mcp.tool()
def {method_name}(**kwargs) -> types.TextContent:
    \"\"\"{doc}\"\"\"
    
    # Check if QuickBooks is initialized
    if quickbooks is None:
        return types.TextContent(type='text', text="Error: QuickBooks session not initialized. Please check your credentials and restart the server.")
    
    # Workaround for clients that pass all arguments as a single string in 'kwargs'
    if 'kwargs' in kwargs and isinstance(kwargs['kwargs'], str) and '=' in kwargs['kwargs']:
        try:
            key, value = kwargs['kwargs'].split('=', 1)
            # Overwrite kwargs with the parsed arguments
            kwargs = {{key: value}}
        except Exception:
            # If parsing fails, do nothing and proceed with the original kwargs
            pass

    print(f"Executing '{method_name}' with arguments: {{kwargs}}", file=sys.stderr)
    
    try:
        route = \"{clean_api_route}\"
        api_method = \"{api['method']}\"
        
        path_params = {{}}
        query_params = {{}}
        request_body = {{}}

        # Separate parameters based on their location ('in')
        api_params = {api_params_filtered}
        for p_info in api_params:
            p_name = p_info['name']
            if p_name in kwargs:
                if p_info['location'] == 'path':
                    path_params[p_name] = kwargs[p_name]
                elif p_info['location'] == 'query':
                    query_params[p_name] = kwargs[p_name]

        # The rest of kwargs are assumed to be the request body for POST/PUT/PATCH
        if api_method.lower() in ['post', 'put', 'patch']:
            body_keys = set(kwargs.keys()) - set(path_params.keys()) - set(query_params.keys())
            for k in body_keys:
                request_body[k] = kwargs[k]

        # Format the route with path parameters
        if path_params:
            try:
                route = route.format(**path_params)
            except KeyError as e:
                return types.TextContent(type='text', text=f"Error: Missing required path parameter {{e}} for route {{route}}")

        response = quickbooks.call_route(
            method_type=api_method,
            route=route,
            params=query_params,
            body=request_body if request_body else None
        )
        
        print(f"Response from '{method_name}': {{response}}", file=sys.stderr)
        return types.TextContent(type='text', text=str(response))
    except Exception as e:
        error_msg = f"Error executing {method_name}: {{e}}"
        print(error_msg, file=sys.stderr)
        return types.TextContent(type='text', text=error_msg)
"""
        exec(method_str, globals(), locals())

register_all_apis()

if __name__ == "__main__":
    print("Starting MCP server...")
    mcp.run(transport='stdio') 