// Turn all elements with ID into variables
identify();

// initialize the loading element, that blocks the screen and all
(function loader(){
    let loading;
    (loading = make()).id = "LOADING";
    showLoading = () => void add(loading);
    hideLoading = () => loading.remove();
    isPageLoading = () => loading.isConnected;
    const N = 10
    for (let n = 0; n < N; n++){
        let c;
        (c = make()).id = 'c'+n;
        c.style.animationDelay = n/N+'s';
        // use other numbers appart from .1 to see effects;
        // will have to change animation-duration and dimensions too
        loading.append(c);
    }
})();