"use client"

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import axios from "axios";
import { fetchAuthSession , getCurrentUser , signOut } from "aws-amplify/auth";
import {router} from "next/client";


export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newExpense, setNewExpense] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    image: null,

  });
  const [userLimit, setUserLimit] = useState("");
  const [view, setView] = useState("addExpense");



  useEffect(() => {
  const fetchExpenses = async (user) => {
    try {
      // Fetch the current authenticated session
      const session = await fetchAuthSession();
      const token = session.tokens.accessToken;
      const user = await getCurrentUser();

      const response = await axios.get(`https://u8ifjxgeug.execute-api.us-east-1.amazonaws.com/dev/user-expenses?userId=${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);
      return JSON.parse(response.data.body);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  fetchExpenses().then(r => setExpenses(r));
  }, []);

  async function handleSignOut() {
    await signOut()
    await router.push('/login');
  }
  const handleInputChange = (e) => {
    setNewExpense({
      ...newExpense,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (value) => {
    setNewExpense({
      ...newExpense,
      category: value,
    });
  };

  const handleImageChange = (e) => {
    setNewExpense({
      ...newExpense,
      image: e.target.files[0],
    });
  };

  const handleAddExpense = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens.accessToken;

      const expense = { ...newExpense, userId: user.username };
      await axios.post(`https://u8ifjxgeug.execute-api.us-east-1.amazonaws.com/dev/add-expense`, expense, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setExpenses([...expenses, expense]);
      setNewExpense({
        date: "",
        description: "",
        amount: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this expense?");
      if (confirmed) {
        const session = await fetchAuthSession();
        const token = session.tokens.accessToken;

        await axios.delete(`https://u8ifjxgeug.execute-api.us-east-1.amazonaws.com/dev/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setExpenses(expenses.filter((expense) => expense.expenseId !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSetLimit = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens.accessToken;

      await axios.post(`https://u8ifjxgeug.execute-api.us-east-1.amazonaws.com/dev/setLimit`, {
        userId: user.username,
        limit: userLimit
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert("Limit set successfully");
    } catch (error) {
      console.error('Error setting limit:', error);
    }
  };

  const filteredExpenses  =
      selectedCategory === "All" ? expenses : expenses.filter((expense) => expense.category === selectedCategory);
  // Ensure expenses is an array and contains valid amount properties before using reduce
  const totalExpense = Array.isArray(expenses) && expenses.length > 0
      ? expenses.reduce((total, expense) => total + (expense.amount || 0), 0)
      : 0;

  return (
      <div className="flex flex-col h-screen bg-primary text-black">
        <header className="bg-primary-foreground py-4 px-6 shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Enforcer</h1>
          <Button onClick={handleSignOut} style={{ backgroundColor: 'black', color: 'white' }} variant="outline">Sign Out</Button>
        </header>
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-background rounded-lg shadow p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-4">{view === "addExpense" ? "Add Expense" : "Set Limit"}</h2>
              <Button onClick={() => setView(view === "addExpense" ? "setLimit" : "addExpense")}>
                {view === "addExpense" ? "Set Limit" : "Add Expense"}
              </Button>
            </div>
            {view === "addExpense" ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newExpense.date}
                        onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        name="description"
                        value={newExpense.description}
                        onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newExpense.amount}
                        onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        id="category"
                        value={newExpense.category}
                        onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        {newExpense.image ? (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <img
                                  src="/placeholder.svg"
                                  alt="Expense Image"
                                  width={200}
                                  height={200}
                                  className="mb-3 w-10 h-10"
                                  style={{ aspectRatio: "200/200", objectFit: "cover" }}
                              />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to change</span> or drag and drop
                              </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadIcon className="w-10 h-10 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                            </div>
                        )}
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </form>
            ) : (
                <div className="space-y-2">
                  <Label htmlFor="limit">Set Limit</Label>
                  <Input
                      id="limit"
                      name="limit"
                      type="number"
                      value={userLimit}
                      onChange={(e) => setUserLimit(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSetLimit}>Set Limit</Button>
                  </div>
                </div>
            )}
            {view === "addExpense" && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </div>
            )}
          </div>
          <div className="bg-background rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Expenses</h2>
            <div className="mb-4">
              <Label htmlFor="filter">Filter by Category</Label>
              <Select
                  id="filter"
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                    <TableRow key={expense.expenseId}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>
                        {expense.image ? (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(URL.createObjectURL(expense.image))}
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span className="sr-only">View Image</span>
                            </Button>
                        ) : (
                            "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteExpense(expense.expenseId)}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right font-bold">Total Expense: ${totalExpense.toFixed(2)}</div>
          </div>
        </main>
      </div>
  );
}

function EyeIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
  );
}

function TrashIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
  );
}

function UploadIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
  );
}
