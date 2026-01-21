export const prepareTransactionLineChartData = (transactions = []) => {
  const map = {};

  transactions.forEach((tx) => {
    const dateObj = new Date(tx.date);
    const dateKey = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!map[dateKey]) {
      map[dateKey] = {
        date: dateKey,
        totalAmount: 0,
        items: [],
        month: formatDayMonth(dateObj),
      };
    }

    map[dateKey].totalAmount += Number(tx.amount);
    map[dateKey].items.push(tx);
  });

  return Object.values(map).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

// helpers
const formatDayMonth = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day}${getSuffix(day)} ${month}`;
};

const getSuffix = (d) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};
