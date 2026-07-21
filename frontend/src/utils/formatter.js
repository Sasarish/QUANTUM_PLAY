//Calculating product discount
export const calculateDiscount = (selling, mrp) => {
    return Math.ceil(((mrp - selling) / mrp) * 100);
};

//Formating date to readable format
export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-In", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
};