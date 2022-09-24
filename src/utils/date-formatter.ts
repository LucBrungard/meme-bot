const formatter = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
});

const getDate = () => {
    const now = new Date;
    const formatted = formatter.format(now);
    return `[${formatted}]`;
};

export { getDate };