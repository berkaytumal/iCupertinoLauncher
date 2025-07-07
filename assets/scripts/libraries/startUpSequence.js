const startUpSequence = function(loaders, finish) {
    const next = (index) => {
        if (index >= loaders.length) {
            if (finish) finish();
            return;
        }

        let called = false;

        const nextCallback = () => {
            if (called) return;
            called = true;
            next(index + 1);
        };

        const currentLoader = loaders[index];
        currentLoader(nextCallback);
    };

    next(0);
};

export default startUpSequence;