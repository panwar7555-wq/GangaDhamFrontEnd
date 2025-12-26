import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import logo from ".//Copilot_20251226_121445.png";

// ✅ Helper to format date as dd-mm-yyyy
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}


function TransactionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
const [filteredTxns, setFilteredTxns] = useState([]);

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]); // ensure array
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    type: "debit",
    remark: ""
  });
  


  // Print popup state
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [fromDate, setFromDate] = useState("");

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://gangadhambackend-1.onrender.com/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch transactions
  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const res = await fetch(`https://gangadhambackend-1.onrender.com/CD/transactions/user/${id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Transactions fetch error:", err);
      }
    };
    fetchTxns();
  }, [id]);

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const url = selectedTxn
        ? `https://gangadhambackend-1.onrender.com/CD/transactions/${selectedTxn._id}`
        : "https://gangadhambackend-1.onrender.com/CD/transactions";
      const method = selectedTxn ? "PUT" : "POST";

      const payload = {
        ...formData,
        name: user.name,
        link: id
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setSelectedTxn(null);
        setFormData({ date: "", amount: "", type: "debit", remark: "" });

        // Refresh user + transactions
        const uRes = await fetch(`https://gangadhambackend-1.onrender.com/users/${id}`);
        const uData = await uRes.json();
        setUser(uData);

        const tRes = await fetch(`https://gangadhambackend-1.onrender.com/CD/transactions/user/${id}`);
        const tData = await tRes.json();
        if (Array.isArray(tData)) setTransactions(tData);
        else if (Array.isArray(tData.transactions)) setTransactions(tData.transactions);
        else setTransactions([]);
      } else {
        alert(data.error || "Failed to save transaction");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server not reachable");
    }
  };
function getFilteredTransactions() {
  // if all filters are empty, just return all transactions
  if (
    !searchFilters.date &&
    !searchFilters.amount &&
    !searchFilters.type &&
    !searchFilters.name &&
    !searchFilters.remark
  ) {
    return transactions;
  }

  // otherwise apply filters
  return transactions.filter((txn) => {
    const matchesDate = searchFilters.date
      ? formatDate(txn.date).includes(searchFilters.date)
      : true;
    const matchesAmount = searchFilters.amount
      ? txn.amount.toString().includes(searchFilters.amount)
      : true;
    const matchesType = searchFilters.type
      ? txn.type.toLowerCase().includes(searchFilters.type.toLowerCase())
      : true;
    const matchesRemark = searchFilters.remark
      ? (txn.remark || "").toLowerCase().includes(searchFilters.remark.toLowerCase())
      : true;

    return matchesDate && matchesAmount && matchesType && matchesRemark;
  });
}

  // Print handler
  const handlePrint = () => {
    if (!user || !fromDate) return;
    if (!Array.isArray(transactions)) return;

    const filteredTxns = transactions.filter(
      (txn) => new Date(txn.date) >= new Date(fromDate)
    );

    // Till date balance = current balance + sum(debit) - sum(credit) for txns after fromDate
    let tillBalance = Number(user.balance) || 0;
    filteredTxns.forEach((txn) => {
      const amt = Number(txn.amount) || 0;
      if (txn.type === "debit") tillBalance += amt;
      else tillBalance -= amt;
    });

const html = `
  <html>
    <head>
      <title>M/s Ganga Dham Filling Station</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f4f4f4;
          padding: 5px 5px;
          border-bottom: 2px solid #ccc;
          margin-bottom: 5px;
        }
        .top-left img {
          height: 100px;
          width: 100px;
          object-fit: contain;
        }
        .top-center {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          flex: 1;
        }
        .top-right {
          text-align: right;
          font-size: 14px;
          line-height: 1.4;
        }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 4px; text-align: left; }
        th { background: #f4f4f4; }
        .debit { background-color: #ffe5e5; }
        .credit { background-color: #e5ffe5; font-weight: bold; }
        .footer { margin-top: 16px; font-weight: bold; }
        @media print { .no-print { display: none; } }
      </style>
      <link rel="preload" href=${logo} as="image">
    </head>
    <body>
      <!-- ✅ Custom Top Bar -->
      <div class="top-bar">
        <div class="top-left">
        <img src=${logo} alt="Logo" style="height:100px;width:100px;" />

        </div>
        <div class="top-center">
          M/s Ganga Dham Filling Station
        </div>
        <div class="top-right">
          <p>📞 9466375648</p>
          <p></p>
        </div>
      </div>

      <!-- ✅ User details -->
      <p><strong>Name:</strong> ${user.name}</p>
      ${user.phoneNumber ? `<p><strong>Phone:</strong> ${user.phoneNumber}</p>` : ""}
      <p><strong>Current Balance:</strong> ${user.balance}</p>

      <h3>Transactions from ${fromDate}</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Amount</th><th>Type</th><th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTxns.length
              ? filteredTxns.slice().reverse().map(txn => `
                <tr class="${txn.type === "debit" ? "debit" : "credit"}">
                  <td>${formatDate(txn.date)}</td>
                  <td>${txn.amount}</td>
                  <td>${txn.type}</td>
                  <td>${txn.remark || ""}</td>
                </tr>
              `).join("")
              : `<tr><td colspan="4" style="text-align:center">No transactions from ${fromDate}</td></tr>`
          }
        </tbody>
      </table>

      <div class="footer">
        Till Date Balance: ${tillBalance}
      </div>
    </body>
  </html>
`;


    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for printing.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  const [searchFilters, setSearchFilters] = useState({
  date: "",
  amount: "",
  type: "",
  remark: ""
});
  return (
    <div>
      {/* User details header with balance-based background */}
      {user && (
        <div className={`user-details ${user.balance <= 0 ? "negative" : "positive"}`}>
          <h2>{user.name}</h2>
          <p><strong>Phone:</strong> {user.phoneNumber || "Not provided"}</p>
          <p><strong>Balance:</strong> {user.balance}</p>
        </div>
      )}

      {/* Top bar */}
      <div className="top-bar">
        <button onClick={() => navigate("/")}>Back</button>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedTxn(null);
            setFormData({ date: "", amount: "", type: "debit", remark: "" });
          }}
        >
          Add Transaction
        </button>
        <button
          onClick={() => {
            if (selectedTxn) {
              setFormData({
                date: (selectedTxn.date || "").slice(0, 10),
                amount: selectedTxn.amount,
                type: selectedTxn.type,
                remark: selectedTxn.remark || ""
              });
              setShowForm(true);
            } else {
              alert("Please select a transaction first");
            }
          }}
        >
          Edit Transaction
        </button>
        <button onClick={() => setShowPrintPopup(true)}>Print</button>
      </div>

      {/* Print popup */}
      {showPrintPopup && (
        <div className="message-box warning">
          <p>Select From Date for printing:</p>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                handlePrint();
                setShowPrintPopup(false);
              }}
            >
              Confirm
            </button>
            <button onClick={() => setShowPrintPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add/Edit Transaction Form */}
      {showForm && (
        <div className="form-container">
          <h3>{selectedTxn ? "Edit Transaction" : "Add Transaction"}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Date:</label><br />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Amount:</label><br />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Type:</label><br />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <div>
              <label>Remark:</label><br />
              <input
                type="text"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              />
            </div>
            <div style={{ marginTop: "15px" }}>
              <button type="submit">{selectedTxn ? "Update" : "Submit"}</button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedTxn(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <table className="users-table">
<thead>
  <tr>
    <th>Date</th>
    <th>Amount</th>
    <th>Type</th>
    <th>Remark</th>
  </tr>
  <tr>
    <td>
      <input
        type="text"
        placeholder="Search date"
        value={searchFilters.date}
        onChange={(e) =>
          setSearchFilters({ ...searchFilters, date: e.target.value })
        }
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Search amount"
        value={searchFilters.amount}
        onChange={(e) =>
          setSearchFilters({ ...searchFilters, amount: e.target.value })
        }
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Search type"
        value={searchFilters.type}
        onChange={(e) =>
          setSearchFilters({ ...searchFilters, type: e.target.value })
        }
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Search remark"
        value={searchFilters.remark}
        onChange={(e) =>
          setSearchFilters({ ...searchFilters, remark: e.target.value })
        }
      />
    </td>
  </tr>
</thead>


        <tbody>
  {Array.isArray(transactions) && getFilteredTransactions().length > 0 ? (
    getFilteredTransactions().map((txn) => (
      <tr
        key={txn._id}
        className={`${selectedTxn?._id === txn._id ? "selected" : ""} ${txn.type === "debit" ? "debit-row" : ""}`}
        onClick={() => {
          setSelectedTxn(txn);
          setShowForm(false);
        }}
      >
        <td>{formatDate(txn.date)}</td>
        <td>{txn.amount}</td>
        <td>{txn.type}</td>
        <td>{txn.remark}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>No transactions found</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}

export default TransactionsPage;
