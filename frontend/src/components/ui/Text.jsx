const Text = ({ children, className }) => {
    return <p className={`text-base text-muted-foreground ${className}`}>{children}</p>;
};

export default Text;
