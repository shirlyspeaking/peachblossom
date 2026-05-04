/// <reference types="../../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { PLAYER_COLORS } from '../config/game';
import { playerAnimal, themeGradientForTileLabel } from '../utils/game';
const props = defineProps();
const emit = defineEmits();
const tileStyle = computed(() => ({
    gridRow: props.row,
    gridColumn: props.col,
    background: themeGradientForTileLabel(props.tile.label) || undefined,
}));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
    ...{ class: "board-tile" },
    ...{ class: (__VLS_ctx.tile.type) },
    ...{ style: (__VLS_ctx.tileStyle) },
});
/** @type {__VLS_StyleScopedClasses['board-tile']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "board-tile__header" },
});
/** @type {__VLS_StyleScopedClasses['board-tile__header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "board-tile__icon" },
});
/** @type {__VLS_StyleScopedClasses['board-tile__icon']} */ ;
(__VLS_ctx.meta.icon);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "board-tile__label" },
});
/** @type {__VLS_StyleScopedClasses['board-tile__label']} */ ;
(__VLS_ctx.tile.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "board-tile__num" },
});
/** @type {__VLS_StyleScopedClasses['board-tile__num']} */ ;
(__VLS_ctx.index + 1);
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.emit('updateField', __VLS_ctx.index, 'label', $event.target.value);
            // @ts-ignore
            [tile, tile, tileStyle, meta, index, index, emit,];
        } },
    ...{ class: "board-tile__input" },
    disabled: (__VLS_ctx.disabled),
    value: (__VLS_ctx.tile.label),
    placeholder: "格名",
});
/** @type {__VLS_StyleScopedClasses['board-tile__input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.emit('updateField', __VLS_ctx.index, 'effect', $event.target.value);
            // @ts-ignore
            [tile, index, emit, disabled,];
        } },
    ...{ class: "board-tile__input" },
    disabled: (__VLS_ctx.disabled),
    value: (__VLS_ctx.tile.effect),
    placeholder: "效果說明",
});
/** @type {__VLS_StyleScopedClasses['board-tile__input']} */ ;
if (__VLS_ctx.tile.owner !== null) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "board-tile__owner" },
        ...{ style: ({ color: __VLS_ctx.PLAYER_COLORS[__VLS_ctx.tile.owner % __VLS_ctx.PLAYER_COLORS.length] }) },
    });
    /** @type {__VLS_StyleScopedClasses['board-tile__owner']} */ ;
    (__VLS_ctx.tile.owner + 1);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-tile__pawns" },
});
/** @type {__VLS_StyleScopedClasses['board-tile__pawns']} */ ;
for (const [pawn] of __VLS_vFor((__VLS_ctx.pawns))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        key: (pawn),
        ...{ class: "board-tile__pawn" },
        ...{ style: ({ background: __VLS_ctx.PLAYER_COLORS[(pawn - 1) % __VLS_ctx.PLAYER_COLORS.length] }) },
    });
    /** @type {__VLS_StyleScopedClasses['board-tile__pawn']} */ ;
    (__VLS_ctx.playerAnimal(pawn - 1));
    // @ts-ignore
    [tile, tile, tile, tile, disabled, PLAYER_COLORS, PLAYER_COLORS, PLAYER_COLORS, PLAYER_COLORS, pawns, playerAnimal,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
