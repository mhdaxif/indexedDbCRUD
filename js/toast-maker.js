(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define('toastmaker', ['exports'], factory) :
            (factory((global.toastmaker = {})));
}(this, (function (exports) {
    'use strict';
    let toasts = {
        error: {
            type: 'error',
            title: 'Error!',
            text: 'Something went wrong'
        },
        success: {
            type: 'success',
            title: 'Sucees',
            text: "Done"
        },
        warning: {
            type: 'warning',
            title: 'warning',
            text: "You got a warning"
        },
        info: {
            type: 'info',
            title: 'info',
            text: "default info"
        },
        toast: (toast) => {
            return {
                type: toast.type ||'success',
                title: toast.title || '',
                text: toast.text || ''
            }
        }
    }

    let config = {
        position: "toast-bottom-right",
        callback: _ => { }, // attach call back
        showMethod: "slideDown", //slideDown, fadeIn
        hideMethod: "slideUp", //fadeOut, slideUp
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        preventDuplicates: true,
        tapToDismiss: true,
        showDuration: 400,
        hideDuration: 400,
        timeOut: 5,
    };

    let create = (toast, setting) => {
        // type = success, error, info, warning,
        applySettings(setting);

        let type = toast.type || "success";
        let title = toast.title || "";
        let text = toast.text || "";

        toastr[type](text, title);
    }


    let applySettings = (options) => {
        if (options) {
            toastr.options = {
                "closeButton": options.closeButton || false,
                "debug": options.debug || false,
                "newestOnTop": options.newestOnTop || false,
                "progressBar": options.progressBa || true,
                "preventDuplicates": options.preventDuplicates || false,
                "tapToDismiss": options.tapToDismiss || true,
                "showDuration": options.showDuration || 1000 * .4,// default .4 sec
                "hideDuration": options.hideDuration || 1000 * .4,
                "timeOut": 1000 * options.timeOut || 1000 * 5,
                "extendedTimeOut": 3000,
                "onclick": _ => options.callback || null, // attach call back
                // toast-top-right, toast-bottom-right, toast-bottom-left, toast-top-left, toast-top-full-width,
                // toast-bottom-full-width, toast-top-center, toast-bottom-center
                "positionClass": options.position || "toast-top-right",
                "showMethod": options.showMethod || "slideDown", //slideDown, fadeIn
                "hideMethod": options.hideMethod || "slideUp", //fadeOut, slideUp
                "showEasing": "swing",
                "hideEasing": "linear"
            }
        }
    }

    applySettings(config);

    // Export to others
    exports.createToast = create;
    exports.toasts = toasts;
    exports.config = config;

    Object.defineProperty(exports, '__esModule', { value: true });
})))
