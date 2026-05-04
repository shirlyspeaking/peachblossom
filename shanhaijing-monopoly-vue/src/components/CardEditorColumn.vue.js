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
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "card-column" },
});
/** @type {__VLS_StyleScopedClasses['card-column']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "card-column__header" },
});
/** @type {__VLS_StyleScopedClasses['card-column__header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: (['card-column__title', __VLS_ctx.accentClass]) },
});
/** @type {__VLS_StyleScopedClasses['card-column__title']} */ ;
(__VLS_ctx.emoji);
(__VLS_ctx.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "card-column__count" },
});
/** @type {__VLS_StyleScopedClasses['card-column__count']} */ ;
(__VLS_ctx.cards.length);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-column__list" },
});
/** @type {__VLS_StyleScopedClasses['card-column__list']} */ ;
for (const [card, index] of __VLS_vFor((__VLS_ctx.cards))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        key: (`${__VLS_ctx.type}-${index}`),
        ...{ class: "card-editor" },
    });
    /** @type {__VLS_StyleScopedClasses['card-editor']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-editor__top" },
    });
    /** @type {__VLS_StyleScopedClasses['card-editor__top']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.title);
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emit('delete', __VLS_ctx.type, index);
                // @ts-ignore
                [accentClass, emoji, title, title, cards, cards, type, type, emit,];
            } },
        type: "button",
        ...{ class: "icon-btn" },
        disabled: (__VLS_ctx.disabled),
    });
    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ onInput: (...[$event]) => {
                __VLS_ctx.emit('update', __VLS_ctx.type, index, 'title', $event.target.value);
                // @ts-ignore
                [type, emit, disabled,];
            } },
        ...{ class: "card-editor__input" },
        disabled: (__VLS_ctx.disabled),
        value: (card.title),
        placeholder: "卡片標題",
    });
    /** @type {__VLS_StyleScopedClasses['card-editor__input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea)({
        ...{ onInput: (...[$event]) => {
                __VLS_ctx.emit('update', __VLS_ctx.type, index, 'content', $event.target.value);
                // @ts-ignore
                [type, emit, disabled,];
            } },
        ...{ class: "card-editor__textarea" },
        disabled: (__VLS_ctx.disabled),
        value: (card.content),
        placeholder: "卡片效果內容",
    });
    /** @type {__VLS_StyleScopedClasses['card-editor__textarea']} */ ;
    // @ts-ignore
    [disabled,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('add', __VLS_ctx.type);
            // @ts-ignore
            [type, emit,];
        } },
    type: "button",
    ...{ class: "secondary-btn" },
    disabled: (__VLS_ctx.disabled),
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
(__VLS_ctx.title);
// @ts-ignore
[title, disabled,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
