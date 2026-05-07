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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Teleport | typeof __VLS_components.Teleport} */
Teleport;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.open) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-root" },
        role: "dialog",
        'aria-modal': "true",
        'aria-label': (__VLS_ctx.title),
    });
    /** @type {__VLS_StyleScopedClasses['dialog-root']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.open))
                    return;
                __VLS_ctx.emit('close');
                // @ts-ignore
                [open, title, emit,];
            } },
        ...{ class: "dialog-backdrop" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-backdrop']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-panel" },
        ...{ class: (`dialog-panel--${__VLS_ctx.width ?? 'medium'}`) },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "dialog-header" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (__VLS_ctx.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.open))
                    return;
                __VLS_ctx.emit('close');
                // @ts-ignore
                [title, emit, width,];
            } },
        type: "button",
        ...{ class: "icon-btn" },
        'aria-label': "關閉",
    });
    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-body" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-body']} */ ;
    var __VLS_6 = {};
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_7 = __VLS_6;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
