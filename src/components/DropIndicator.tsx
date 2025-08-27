export const DropIndicator = ({ beforeId, column, headingColor }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className={`my-0.5 h-0.5 w-full bg-${headingColor}-500 opacity-0`}
        />
    );
};