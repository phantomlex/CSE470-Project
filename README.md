# MoneyMap - An Finance Management Website

MoneyMap is a comprehensive digital platform designed to help individuals efficiently track and manage their personal finances. It provides a big-picture view of your financial health by offering tools for monitoring income, expenses, debt, and budgets. The platform empowers users to make informed financial decisions, reduce debt, and achieve savings goals through features like data visualization, budget planning, and goal-setting.

The name 'MoneyMap' reflects its purpose: a user-friendly space for navigating all aspects of personal finance, from tracking spending to achieving financial objectives.

## Features

MoneyMap offers a robust set of features to help you take control of your finances:

#### Comprehensive Financial Tracking:

-Add entries with details like name, amount, date, and category.

-Categorize income sources (e.g., salary, freelance).

-Categorize expenses (e.g., food, education, entertainment).

-Display current balance, total income, and total expenses.

#### Data Visualization:

-View line graphs showing income/expenses over time.

-Visualize spending distribution with pie charts.

-Access a summary of financial statistics.

-Adjust time frames for graphs (e.g., monthly, daily).

#### Data Management and Export/Import:

-Export transaction history to a CSV file.

-Import transaction history from a CSV file.

-Sort transactions by date, amount, and tag.

-Search and filter transactions by name or category.

#### Budget Planning and Goal Setting:

-Set monthly or weekly budgets for specific categories (e.g., food, transport).

-Set savings goals with target amounts and deadlines, tracking progress.

-Receive notifications when spending approaches or exceeds a budgeted limit.

-Display a summary of budgets vs. actual spending by category.

#### Debt Management:

-Add and categorize debts (e.g., credit card, loan, mortgage) with details such as amount, interest rate, and due dates.

-Track debt repayments and remaining balance over time.

-Set up automated reminders for upcoming due dates to avoid missed payments.

-Calculate and display the estimated date when debt will end based on the current repayment rate.

## Technologies Used

MoneyMap is built using the MERN stack, along with other essential libraries and tools:

##### Frontend:

-React.js (JavaScript library for building user interfaces)

-TypeScript

##### Backend:

-Node.js (JavaScript runtime environment)

-Express.js (Backend web application framework)

-TypeScript

##### Database:

-MongoDB (NoSQL database system)

##### Authentication:

-Clerk


## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

-Node.js (which includes npm)

-Yarn (optional, but recommended if you prefer it over npm)

-Ensure that the `back` and `front` folders are located in the same parent directory after cloning.

### Environment Variables

You will need to set up environment variables for the project.

Create a `.env.local` file in your `front` directory with the following content:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZmFzdC1yYXR0bGVyLTg2LmNsZXJrLmacccounts.dev$
```

Note: While MongoDB integration is handled automatically within the project, if you need to specify a custom MongoDB URI, you might need to add a `MONGODB_URI` environment variable in your `back` folder's `.env.local` file, depending on your backend configuration.

### Installation

Navigate into both the `back` and `front` directories and install the dependencies.

##### Using Yarn:

###### For the backend:
```bash
cd back
yarn
cd .. 
```
###### For the frontend:
```bash
cd front
yarn
cd ..
```

##### Using npm:

###### For the backend:
```bash
cd back
npm install
cd .. 
```
###### For the frontend:
```bash
cd front
npm install
cd ..
```

###### You may also need to install specific packages if you encounter errors:

```bash
npm install react-table
npm install --save-dev @types/react-table
npm i --save-dev @types/papaparse
```

## Running the Application

You will need two separate terminal windows for the backend and frontend.

#### 1. Start the Backend:

Navigate to the `back` directory and run:

###### Using Yarn:

```bash
cd back
yarn dev
```
###### Using npm:

```bash
cd back
npm run dev
```

#### 2. Start the Frontend:

Open a new terminal window, navigate to the `front` directory, and run:


###### Using Yarn:

```bash
cd front
yarn dev
```
###### Using npm:

```bash
cd front
npm run dev
```

## Usage

Once the application is running, you can:

-Register a new user account using Clerk's authentication flow.

-Log in to your MoneyMap dashboard.

-Start adding your income and expenses, categorizing them as needed.

-Explore the data visualizations to understand your financial trends.

-Set up budgets and savings goals to track your progress.

-Manage your debts and set repayment reminders.

-Export or import your transaction history.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## Acknowledgements

-This project was developed for the CSE470 course.

-Inspired by and learned from https://www.github.com/machadop1407/financial-tracker-react

-Special thanks to the YouTube community and resources like https://www.youtube.com/watch?v=4NZx9OF07qY for guidance and inspiration.

