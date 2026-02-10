# Centurion Card Categorization Guide

## Bank Rules

Create these in **QuickBooks → Settings → Rules → New Rule**

### Groceries & Food

| Rule Name | Bank Text Contains | Category |
|-----------|-------------------|----------|
| Groceries - Publix | `Publix` | 8610 Food - Groceries |
| Groceries - Instacart | `Instacart` | 8610 Food - Groceries |
| Groceries - Whole Foods | `Whole Foods` | 8610 Food - Groceries |
| Delivery - DoorDash | `DoorDash` | 8630 Food - Delivery |
| Delivery - UberEats | `Uber Eats` | 8630 Food - Delivery |
| Coffee - Starbucks | `Starbucks` | 8640 Food - Coffee & Snacks |

### Subscriptions

| Rule Name | Bank Text Contains | Category |
|-----------|-------------------|----------|
| Streaming - Fubo | `Fubo` | 8721 Subscriptions - Streaming |
| Streaming - Netflix | `Netflix` | 8721 Subscriptions - Streaming |
| Streaming - Sirius | `Sirius` | 8721 Subscriptions - Streaming |
| Apps - Apple | `Apple` | 8722 Subscriptions - Apps & Software |
| Apps - Audible | `Audible` | 8722 Subscriptions - Apps & Software |
| News - Athletic | `Athletic` | 8723 Subscriptions - News & Media |

### Transportation

| Rule Name | Bank Text Contains | Category |
|-----------|-------------------|----------|
| Rideshare - Uber | `Uber` | 8075 Vehicle - Rideshare |
| Rideshare - Lyft | `Lyft` | 8075 Vehicle - Rideshare |
| Tolls - SunPass | `SunPass` | 8070 Vehicle - Registration & Fees |
| Parking | `Parkreceipts` | 8070 Vehicle - Registration & Fees |

### Health & Fitness

| Rule Name | Bank Text Contains | Category |
|-----------|-------------------|----------|
| Fitness - Oura | `Ouraring` | 8550 Health - Fitness |

### Shopping

| Rule Name | Bank Text Contains | Category |
|-----------|-------------------|----------|
| Amazon | `Amazon` | 8925 Amazon Purchases |

---

## Personal Expense Chart of Accounts (8000-8999)

```
8000 Vehicle Expenses
  ├─ 8010 Vehicle - GM Financial Loan
  ├─ 8020 Vehicle - Audi Financial Loan
  ├─ 8030 Vehicle - CAF Lease
  ├─ 8040 Vehicle - Insurance
  ├─ 8050 Vehicle - Gas & Fuel
  ├─ 8060 Vehicle - Maintenance & Repairs
  ├─ 8070 Vehicle - Registration & Fees (tolls, parking)
  └─ 8075 Vehicle - Rideshare (Uber, Lyft)

8100 Housing & Property
  ├─ 8110 Property - Taxes
  ├─ 8120 Property - HOA Fees
  ├─ 8130 Property - Maintenance
  └─ 8140 Property - Improvements

8200 Utilities
  ├─ 8210 Utilities - Electric
  ├─ 8220 Utilities - Gas
  ├─ 8230 Utilities - Water & Sewer
  ├─ 8240 Utilities - Internet & Cable
  ├─ 8250 Utilities - Phone
  └─ 8260 Utilities - Security

8300 Insurance
  ├─ 8310 Insurance - Homeowners
  ├─ 8320 Insurance - Umbrella
  ├─ 8330 Insurance - Life
  └─ 8340 Insurance - Other

8400 Personal Services
  ├─ 8410 Services - Housekeeping
  ├─ 8420 Services - Landscaping
  ├─ 8430 Services - Personal Assistant
  ├─ 8440 Services - Childcare
  └─ 8450 Services - Pet Care

8500 Health & Wellness
  ├─ 8510 Health - Medical
  ├─ 8520 Health - Dental
  ├─ 8530 Health - Vision
  ├─ 8540 Health - Pharmacy
  ├─ 8550 Health - Fitness (Oura, gym)
  └─ 8560 Health - Wellness

8600 Food & Dining
  ├─ 8610 Food - Groceries (Publix, Instacart)
  ├─ 8620 Food - Restaurants
  ├─ 8630 Food - Delivery (DoorDash, UberEats)
  └─ 8640 Food - Coffee & Snacks

8700 Entertainment & Lifestyle
  ├─ 8710 Entertainment - Events
  ├─ 8720 Entertainment - Subscriptions (general)
  │   ├─ 8721 Subscriptions - Streaming (Fubo, Netflix)
  │   ├─ 8722 Subscriptions - Apps & Software (Apple, Audible)
  │   └─ 8723 Subscriptions - News & Media (Athletic)
  ├─ 8730 Entertainment - Hobbies
  └─ 8740 Entertainment - Travel (Personal)

8800 Family & Gifts
  ├─ 8810 Family - Activities (Camp Winadu, sports, lessons)
  ├─ 8820 Family - Allowances
  └─ 8830 Family - Gifts

8900 Other Personal
  ├─ 8910 Personal - Clothing (Louboutin, Crocs)
  ├─ 8920 Personal - Electronics
  ├─ 8925 Amazon Purchases
  ├─ 8930 Personal - Donations
  ├─ 8940 Personal - Professional Dues
  └─ 8990 Personal - Miscellaneous
```

---

## Common Transaction Examples

| Merchant | Amount | Category |
|----------|--------|----------|
| Camp Winadu | $8,291.50 | 8810 Family - Activities |
| Christian Louboutin | $1,385.65 | 8910 Personal - Clothing |
| Simply Dealer | $1,154.61 | 8060 Vehicle - Maintenance |
| Amazon (any) | varies | 8925 Amazon Purchases |
| Apple (subscriptions) | varies | 8722 Subscriptions - Apps & Software |
| Publix | varies | 8610 Food - Groceries |
| Instacart | varies | 8610 Food - Groceries |
| Uber | varies | 8075 Vehicle - Rideshare |
| SunPass | varies | 8070 Vehicle - Registration & Fees |
| Fubo TV | $114.27 | 8721 Subscriptions - Streaming |
| Restaurants (misc) | varies | 8620 Food - Restaurants |

---

## Workflow

1. **Weekly:** Review "For Review" queue in QuickBooks Banking tab
2. **For each transaction:**
   - If bank rule exists → Auto-categorized, just accept
   - If no rule → Manually select category from 8000-series
   - If new recurring merchant → Create a new bank rule
3. **Monthly:** Run spending report by category to verify accuracy

---

## Notes

- **Amazon Strategy:** All Amazon purchases go to 8925. Review quarterly if you want to split into specific categories.
- **Restaurants:** Use 8620 for personal dining. If business meal with client, use the business accounts (6210/6220).
- **Apple:** Most Apple charges are subscriptions (8722). Large one-time purchases may be electronics (8920).
