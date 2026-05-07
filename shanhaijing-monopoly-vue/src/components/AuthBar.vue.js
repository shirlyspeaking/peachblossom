/// <reference types="../../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "auth-bar" },
    'aria-live': "polite",
});
/** @type {__VLS_StyleScopedClasses['auth-bar']} */ ;
if (__VLS_ctx.status === 'loading') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "auth-text" },
    });
    /** @type {__VLS_StyleScopedClasses['auth-text']} */ ;
}
else if (__VLS_ctx.status === 'authenticated' && __VLS_ctx.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "auth-text" },
        title: (__VLS_ctx.user.email),
    });
    /** @type {__VLS_StyleScopedClasses['auth-text']} */ ;
    (__VLS_ctx.user.email);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.status === 'loading'))
                    return;
                if (!(__VLS_ctx.status === 'authenticated' && __VLS_ctx.user))
                    return;
                __VLS_ctx.emit('logout');
                // @ts-ignore
                [status, status, user, user, user, emit,];
            } },
        type: "button",
        ...{ class: "pill-btn pill-btn--ghost" },
    });
    /** @type {__VLS_StyleScopedClasses['pill-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['pill-btn--ghost']} */ ;
}
else if (__VLS_ctx.status === 'error') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "auth-text auth-text--warn" },
    });
    /** @type {__VLS_StyleScopedClasses['auth-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['auth-text--warn']} */ ;
    (__VLS_ctx.error || '連線失敗');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.status === 'loading'))
                    return;
                if (!!(__VLS_ctx.status === 'authenticated' && __VLS_ctx.user))
                    return;
                if (!(__VLS_ctx.status === 'error'))
                    return;
                __VLS_ctx.emit('retry');
                // @ts-ignore
                [status, emit, error,];
            } },
        type: "button",
        ...{ class: "pill-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['pill-btn']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.status === 'loading'))
                    return;
                if (!!(__VLS_ctx.status === 'authenticated' && __VLS_ctx.user))
                    return;
                if (!!(__VLS_ctx.status === 'error'))
                    return;
                __VLS_ctx.emit('login');
                // @ts-ignore
                [emit,];
            } },
        type: "button",
        ...{ class: "pill-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['pill-btn']} */ ;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
