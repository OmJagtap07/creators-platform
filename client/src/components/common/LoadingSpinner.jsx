const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            <p style={textStyle}>{message}</p>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
};

const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid #1e293b',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

const textStyle = {
    marginTop: '1rem',
    color: '#94a3b8',
    fontSize: '1.1rem',
};

export default LoadingSpinner;
