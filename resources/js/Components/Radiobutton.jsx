export default function Radiobutton({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="radio"
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' +
                className
            }
        />
    );
}
