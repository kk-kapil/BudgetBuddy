// utils.js
export const currencyFormatter = (amount) => {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    });
    return formatter.format(amount);
};

