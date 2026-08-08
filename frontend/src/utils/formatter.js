//Calculating product discount
export const calculateDiscount = (selling, mrp) => {
    if (!mrp || mrp <= 0) return 0;
    const discount = Math.ceil(((mrp - selling) / mrp) * 100);
    return discount > 0 ? discount : 0;
};

//Formating date to readable format
export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
};