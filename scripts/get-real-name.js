const getRealName = (str) => {
    const arr = str.split('/');
    str = arr[arr.length - 1];

    return str;
};

export default getRealName;