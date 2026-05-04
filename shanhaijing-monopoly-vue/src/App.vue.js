/// <reference types="../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../private/var/folders/qk/7fh6bkbs77q4kq_bnmf_7y9h0000gn/T/cursor-sandbox-cache/7bc7256c989cf17275bc2d93dee5fce2/npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onBeforeUnmount, onMounted } from 'vue';
import AuthBar from './components/AuthBar.vue';
import BaseDialog from './components/BaseDialog.vue';
import BoardTile from './components/BoardTile.vue';
import CardEditorColumn from './components/CardEditorColumn.vue';
import { PLAYER_COLORS } from './config/game';
import { login, logout, refreshSession } from './composables/usePeachAuth';
import { useAuthStore } from './stores/auth';
import { useGameStore } from './stores/game';
const game = useGameStore().api;
const { authState } = useAuthStore().api;
const onKeydown = (event) => {
    if (event.key !== 'Escape')
        return;
    if (game.rulesModalOpen) {
        game.rulesModalOpen = false;
    }
    else if (game.medalModal.open) {
        game.closeMedalPopup();
    }
    else if (game.buyLandModal.open) {
        game.closeBuyLandPopup(false);
    }
    else if (game.sideDrawer) {
        game.closeSideDrawer();
    }
};
const pawnPositions = computed(() => game.tiles.map((tile) => game.state.game.players
    .map((player, index) => ({ position: player.position, playerNumber: index + 1 }))
    .filter((item) => item.position === tile.index)
    .map((item) => item.playerNumber)));
const recentTurnLog = computed(() => game.state.game.turnLog.slice(-30));
onMounted(async () => {
    await game.initialize();
    window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-shell" },
});
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "topbar" },
});
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "topbar__title" },
});
/** @type {__VLS_StyleScopedClasses['topbar__title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "topbar__actions" },
});
/** @type {__VLS_StyleScopedClasses['topbar__actions']} */ ;
const __VLS_0 = AuthBar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onLogin': {} },
    ...{ 'onLogout': {} },
    ...{ 'onRetry': {} },
    status: (__VLS_ctx.authState.status),
    user: (__VLS_ctx.authState.user ?? null),
    error: (__VLS_ctx.authState.error),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onLogin': {} },
    ...{ 'onLogout': {} },
    ...{ 'onRetry': {} },
    status: (__VLS_ctx.authState.status),
    user: (__VLS_ctx.authState.user ?? null),
    error: (__VLS_ctx.authState.error),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ login: {} },
    { onLogin: (__VLS_ctx.login) });
const __VLS_7 = ({ logout: {} },
    { onLogout: (__VLS_ctx.logout) });
const __VLS_8 = ({ retry: {} },
    { onRetry: (__VLS_ctx.refreshSession) });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ class: "back-link" },
    href: "../index.html",
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ class: "back-link back-link--secondary" },
    href: "../shanhaijing-monopoly/index.html",
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link--secondary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "hero-panel hero-panel--orbit-only" },
    'aria-label': "裝飾動畫",
});
/** @type {__VLS_StyleScopedClasses['hero-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-panel--orbit-only']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hero-orbit" },
    'aria-hidden': "true",
});
/** @type {__VLS_StyleScopedClasses['hero-orbit']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-orbit__ring" },
});
/** @type {__VLS_StyleScopedClasses['hero-orbit__ring']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-orbit__beast" },
});
/** @type {__VLS_StyleScopedClasses['hero-orbit__beast']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-orbit__dice" },
});
/** @type {__VLS_StyleScopedClasses['hero-orbit__dice']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-orbit__spark hero-orbit__spark--one" },
});
/** @type {__VLS_StyleScopedClasses['hero-orbit__spark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-orbit__spark--one']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-orbit__spark hero-orbit__spark--two" },
});
/** @type {__VLS_StyleScopedClasses['hero-orbit__spark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-orbit__spark--two']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "online-panel" },
});
/** @type {__VLS_StyleScopedClasses['online-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "online-panel__actions" },
});
/** @type {__VLS_StyleScopedClasses['online-panel__actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.createOnlineRoom) },
    type: "button",
    ...{ class: "primary-btn" },
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "inline-field" },
});
/** @type {__VLS_StyleScopedClasses['inline-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.game.roomCodeInput),
    type: "text",
    maxlength: "8",
    placeholder: "ABCDEF",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.joinOnlineRoom) },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.leaveOnlineMode) },
    type: "button",
    ...{ class: "danger-btn" },
    disabled: (!__VLS_ctx.game.online.mode),
});
/** @type {__VLS_StyleScopedClasses['danger-btn']} */ ;
if (__VLS_ctx.game.online.mode) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "online-panel__status" },
    });
    /** @type {__VLS_StyleScopedClasses['online-panel__status']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.game.onlineStatusText);
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: (__VLS_ctx.game.onlineRoomShareUrl),
    });
    (__VLS_ctx.game.onlineRoomShareUrl);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "workspace-shell" },
});
/** @type {__VLS_StyleScopedClasses['workspace-shell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "board-panel" },
});
/** @type {__VLS_StyleScopedClasses['board-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-header" },
});
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-actions" },
});
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.rulesModalOpen = true;
            // @ts-ignore
            [authState, authState, authState, login, logout, refreshSession, game, game, game, game, game, game, game, game, game, game,];
        } },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.restartGameSession) },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.resetToDefault) },
    type: "button",
    ...{ class: "danger-btn" },
});
/** @type {__VLS_StyleScopedClasses['danger-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-scroll" },
});
/** @type {__VLS_StyleScopedClasses['board-scroll']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-grid" },
});
/** @type {__VLS_StyleScopedClasses['board-grid']} */ ;
for (const [tile, index] of __VLS_vFor((__VLS_ctx.game.tiles))) {
    const __VLS_9 = BoardTile;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        ...{ 'onUpdateField': {} },
        key: (index),
        tile: (tile),
        index: (index),
        row: (tile.row),
        col: (tile.col),
        meta: (tile.meta),
        disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        pawns: (__VLS_ctx.pawnPositions[index]),
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onUpdateField': {} },
        key: (index),
        tile: (tile),
        index: (index),
        row: (tile.row),
        col: (tile.col),
        meta: (tile.meta),
        disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        pawns: (__VLS_ctx.pawnPositions[index]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_14;
    const __VLS_15 = ({ updateField: {} },
        { onUpdateField: (__VLS_ctx.game.updateTileField) });
    var __VLS_12;
    var __VLS_13;
    // @ts-ignore
    [game, game, game, game, game, pawnPositions,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "board-center" },
});
/** @type {__VLS_StyleScopedClasses['board-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-center__block" },
});
/** @type {__VLS_StyleScopedClasses['board-center__block']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "inline-field" },
});
/** @type {__VLS_StyleScopedClasses['inline-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.game.setPlayerCount(Number($event.target.value));
            // @ts-ignore
            [game,];
        } },
    value: (__VLS_ctx.game.state.game.playerCount),
    disabled: (__VLS_ctx.game.online.mode),
});
for (const [count] of __VLS_vFor(([2, 3, 4, 5, 6]))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (count),
        value: (count),
    });
    (count);
    // @ts-ignore
    [game, game,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-list" },
});
/** @type {__VLS_StyleScopedClasses['player-list']} */ ;
for (const [player, index] of __VLS_vFor((__VLS_ctx.game.state.game.players))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        key: (player.id),
        ...{ class: "player-card" },
        ...{ class: ({ 'player-card--active': index === __VLS_ctx.game.state.game.currentPlayerIndex }) },
    });
    /** @type {__VLS_StyleScopedClasses['player-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['player-card--active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "player-card__identity" },
    });
    /** @type {__VLS_StyleScopedClasses['player-card__identity']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "player-token" },
        ...{ style: ({ background: __VLS_ctx.PLAYER_COLORS[index % __VLS_ctx.PLAYER_COLORS.length] }) },
    });
    /** @type {__VLS_StyleScopedClasses['player-token']} */ ;
    (__VLS_ctx.game.playerAnimal(index));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.game.titleForPlayer(index));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.game.statusForPlayer(index));
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "inline-field inline-field--stacked" },
    });
    /** @type {__VLS_StyleScopedClasses['inline-field']} */ ;
    /** @type {__VLS_StyleScopedClasses['inline-field--stacked']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ onChange: (...[$event]) => {
                __VLS_ctx.game.updatePlayerMoney(index, Number($event.target.value));
                // @ts-ignore
                [game, game, game, game, game, game, PLAYER_COLORS, PLAYER_COLORS,];
            } },
        type: "number",
        min: "0",
        step: "1",
        disabled: (!__VLS_ctx.game.canEditPlayerMoney(index)),
        value: (player.money),
    });
    // @ts-ignore
    [game,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-center__block board-center__block--dice" },
});
/** @type {__VLS_StyleScopedClasses['board-center__block']} */ ;
/** @type {__VLS_StyleScopedClasses['board-center__block--dice']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dice-shell" },
    ...{ class: ({ 'dice-shell--rolling': __VLS_ctx.game.isRolling }) },
});
/** @type {__VLS_StyleScopedClasses['dice-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['dice-shell--rolling']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "dice-shell__emoji" },
});
/** @type {__VLS_StyleScopedClasses['dice-shell__emoji']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.game.diceValue);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.rollDice) },
    type: "button",
    ...{ class: "primary-btn primary-btn--wide" },
    disabled: (__VLS_ctx.game.isRolling),
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn--wide']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "draw-actions" },
});
/** @type {__VLS_StyleScopedClasses['draw-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.drawCard('chance');
            // @ts-ignore
            [game, game, game, game, game,];
        } },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.drawCard('fate');
            // @ts-ignore
            [game,];
        } },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "board-center__block" },
});
/** @type {__VLS_StyleScopedClasses['board-center__block']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "turn-log" },
});
/** @type {__VLS_StyleScopedClasses['turn-log']} */ ;
for (const [line, index] of __VLS_vFor((__VLS_ctx.recentTurnLog))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        key: (`${index}-${line}`),
    });
    (line);
    // @ts-ignore
    [recentTurnLog,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "drawer-rail" },
    role: "toolbar",
    'aria-label': "側邊工具",
});
/** @type {__VLS_StyleScopedClasses['drawer-rail']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.toggleSideDrawer('presets');
            // @ts-ignore
            [game,];
        } },
    type: "button",
    ...{ class: "drawer-rail__btn" },
    ...{ class: ({ 'drawer-rail__btn--active': __VLS_ctx.game.sideDrawer === 'presets' }) },
    'aria-pressed': (__VLS_ctx.game.sideDrawer === 'presets'),
});
/** @type {__VLS_StyleScopedClasses['drawer-rail__btn']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-rail__btn--active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "drawer-rail__label" },
});
/** @type {__VLS_StyleScopedClasses['drawer-rail__label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.toggleSideDrawer('cards');
            // @ts-ignore
            [game, game, game,];
        } },
    type: "button",
    ...{ class: "drawer-rail__btn" },
    ...{ class: ({ 'drawer-rail__btn--active': __VLS_ctx.game.sideDrawer === 'cards' }) },
    'aria-pressed': (__VLS_ctx.game.sideDrawer === 'cards'),
});
/** @type {__VLS_StyleScopedClasses['drawer-rail__btn']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-rail__btn--active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "drawer-rail__label" },
});
/** @type {__VLS_StyleScopedClasses['drawer-rail__label']} */ ;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    name: "drawer-backdrop",
}));
const __VLS_18 = __VLS_17({
    name: "drawer-backdrop",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
if (__VLS_ctx.game.sideDrawer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.game.closeSideDrawer) },
        ...{ class: "drawer-backdrop" },
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['drawer-backdrop']} */ ;
}
// @ts-ignore
[game, game, game, game,];
var __VLS_19;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    name: "drawer-panel",
}));
const __VLS_24 = __VLS_23({
    name: "drawer-panel",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
if (__VLS_ctx.game.sideDrawer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
        ...{ class: "drawer-panel" },
        role: "dialog",
        'aria-labelledby': (__VLS_ctx.game.sideDrawer === 'presets' ? 'drawer-title-presets' : 'drawer-title-cards'),
    });
    /** @type {__VLS_StyleScopedClasses['drawer-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "drawer-panel__header panel-header" },
    });
    /** @type {__VLS_StyleScopedClasses['drawer-panel__header']} */ ;
    /** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "eyebrow" },
    });
    /** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
    (__VLS_ctx.game.sideDrawer === 'presets' ? 'Presets' : 'Cards');
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        id: (__VLS_ctx.game.sideDrawer === 'presets' ? 'drawer-title-presets' : 'drawer-title-cards'),
    });
    (__VLS_ctx.game.sideDrawer === 'presets' ? '棋盤收藏' : '卡片設置');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.game.closeSideDrawer) },
        type: "button",
        ...{ class: "secondary-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "drawer-panel__body" },
    });
    /** @type {__VLS_StyleScopedClasses['drawer-panel__body']} */ ;
    if (__VLS_ctx.game.sideDrawer === 'presets') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "panel-note drawer-panel__lede" },
        });
        /** @type {__VLS_StyleScopedClasses['panel-note']} */ ;
        /** @type {__VLS_StyleScopedClasses['drawer-panel__lede']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "preset-panel" },
        });
        /** @type {__VLS_StyleScopedClasses['preset-panel']} */ ;
        if (__VLS_ctx.authState.user) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
                ...{ class: "inline-field inline-field--stacked" },
            });
            /** @type {__VLS_StyleScopedClasses['inline-field']} */ ;
            /** @type {__VLS_StyleScopedClasses['inline-field--stacked']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
                value: (__VLS_ctx.game.presetNameInput),
                type: "text",
                maxlength: "40",
                placeholder: "例如：春節親子版",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (__VLS_ctx.game.savePreset) },
                type: "button",
                ...{ class: "secondary-btn" },
            });
            /** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
                ...{ class: "inline-field inline-field--stacked" },
            });
            /** @type {__VLS_StyleScopedClasses['inline-field']} */ ;
            /** @type {__VLS_StyleScopedClasses['inline-field--stacked']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
                value: (__VLS_ctx.game.selectedPresetId),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                value: "",
            });
            for (const [preset] of __VLS_vFor((__VLS_ctx.game.boardPresets))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                    key: (preset.id),
                    value: (preset.id),
                });
                (preset.name);
                (new Date(preset.savedAt).toLocaleDateString());
                // @ts-ignore
                [authState, game, game, game, game, game, game, game, game, game, game, game,];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "preset-actions" },
            });
            /** @type {__VLS_StyleScopedClasses['preset-actions']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (__VLS_ctx.game.loadPreset) },
                type: "button",
                ...{ class: "secondary-btn" },
                disabled: (!__VLS_ctx.game.selectedPresetId),
            });
            /** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (__VLS_ctx.game.deletePreset) },
                type: "button",
                ...{ class: "danger-btn" },
                disabled: (!__VLS_ctx.game.selectedPresetId),
            });
            /** @type {__VLS_StyleScopedClasses['danger-btn']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "panel-note" },
            });
            /** @type {__VLS_StyleScopedClasses['panel-note']} */ ;
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "cards-grid cards-grid--drawer" },
        });
        /** @type {__VLS_StyleScopedClasses['cards-grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['cards-grid--drawer']} */ ;
        const __VLS_28 = CardEditorColumn;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
            ...{ 'onAdd': {} },
            ...{ 'onUpdate': {} },
            ...{ 'onDelete': {} },
            title: "機會卡",
            emoji: "🟡",
            accentClass: "card-column__title--chance",
            cards: (__VLS_ctx.game.state.chance),
            type: "chance",
            disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onAdd': {} },
            ...{ 'onUpdate': {} },
            ...{ 'onDelete': {} },
            title: "機會卡",
            emoji: "🟡",
            accentClass: "card-column__title--chance",
            cards: (__VLS_ctx.game.state.chance),
            type: "chance",
            disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_33;
        const __VLS_34 = ({ add: {} },
            { onAdd: (__VLS_ctx.game.addCard) });
        const __VLS_35 = ({ update: {} },
            { onUpdate: (__VLS_ctx.game.updateCard) });
        const __VLS_36 = ({ delete: {} },
            { onDelete: (__VLS_ctx.game.deleteCard) });
        var __VLS_31;
        var __VLS_32;
        const __VLS_37 = CardEditorColumn;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            ...{ 'onAdd': {} },
            ...{ 'onUpdate': {} },
            ...{ 'onDelete': {} },
            title: "命運卡",
            emoji: "🔵",
            accentClass: "card-column__title--fate",
            cards: (__VLS_ctx.game.state.fate),
            type: "fate",
            disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        }));
        const __VLS_39 = __VLS_38({
            ...{ 'onAdd': {} },
            ...{ 'onUpdate': {} },
            ...{ 'onDelete': {} },
            title: "命運卡",
            emoji: "🔵",
            accentClass: "card-column__title--fate",
            cards: (__VLS_ctx.game.state.fate),
            type: "fate",
            disabled: (!__VLS_ctx.game.canEditBoardAndCards),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        let __VLS_42;
        const __VLS_43 = ({ add: {} },
            { onAdd: (__VLS_ctx.game.addCard) });
        const __VLS_44 = ({ update: {} },
            { onUpdate: (__VLS_ctx.game.updateCard) });
        const __VLS_45 = ({ delete: {} },
            { onDelete: (__VLS_ctx.game.deleteCard) });
        var __VLS_40;
        var __VLS_41;
    }
}
// @ts-ignore
[game, game, game, game, game, game, game, game, game, game, game, game, game, game,];
var __VLS_25;
const __VLS_46 = BaseDialog || BaseDialog;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.rulesModalOpen),
    title: "基本規則",
    width: "wide",
}));
const __VLS_48 = __VLS_47({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.rulesModalOpen),
    title: "基本規則",
    width: "wide",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
const __VLS_52 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.game.rulesModalOpen = false;
            // @ts-ignore
            [game, game,];
        } });
const { default: __VLS_53 } = __VLS_49.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.game.syncRulesText($event.target.value);
            // @ts-ignore
            [game,];
        } },
    ...{ class: "rules-textarea rules-textarea--dialog" },
    disabled: (!__VLS_ctx.game.canEditBoardAndCards),
    value: (__VLS_ctx.game.state.rulesText),
});
/** @type {__VLS_StyleScopedClasses['rules-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['rules-textarea--dialog']} */ ;
// @ts-ignore
[game, game,];
var __VLS_49;
var __VLS_50;
const __VLS_54 = BaseDialog || BaseDialog;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.medalModal.open),
    title: (__VLS_ctx.game.medalModal.type === 'chance' ? '機會卡' : '命運卡'),
    width: "narrow",
}));
const __VLS_56 = __VLS_55({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.medalModal.open),
    title: (__VLS_ctx.game.medalModal.type === 'chance' ? '機會卡' : '命運卡'),
    width: "narrow",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_59;
const __VLS_60 = ({ close: {} },
    { onClose: (__VLS_ctx.game.closeMedalPopup) });
const { default: __VLS_61 } = __VLS_57.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "medal-card" },
    ...{ class: (`medal-card--${__VLS_ctx.game.medalModal.type}`) },
});
/** @type {__VLS_StyleScopedClasses['medal-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
(__VLS_ctx.game.medalModal.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.game.medalModal.body);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.game.closeMedalPopup) },
    type: "button",
    ...{ class: "primary-btn primary-btn--wide" },
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn--wide']} */ ;
// @ts-ignore
[game, game, game, game, game, game, game,];
var __VLS_57;
var __VLS_58;
const __VLS_62 = BaseDialog || BaseDialog;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.buyLandModal.open),
    title: "購買地塊",
    width: "narrow",
}));
const __VLS_64 = __VLS_63({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.game.buyLandModal.open),
    title: "購買地塊",
    width: "narrow",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.game.closeBuyLandPopup(false);
            // @ts-ignore
            [game, game,];
        } });
const { default: __VLS_69 } = __VLS_65.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "buy-panel" },
});
/** @type {__VLS_StyleScopedClasses['buy-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p)({});
__VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.game.buyLandModal.html) }, null, null);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "buy-panel__actions" },
});
/** @type {__VLS_StyleScopedClasses['buy-panel__actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.closeBuyLandPopup(true);
            // @ts-ignore
            [game, game,];
        } },
    type: "button",
    ...{ class: "primary-btn" },
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.game.closeBuyLandPopup(false);
            // @ts-ignore
            [game,];
        } },
    type: "button",
    ...{ class: "secondary-btn" },
});
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
// @ts-ignore
[];
var __VLS_65;
var __VLS_66;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    name: "toast-fade",
}));
const __VLS_72 = __VLS_71({
    name: "toast-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
const { default: __VLS_75 } = __VLS_73.slots;
if (__VLS_ctx.game.toastMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "toast" },
    });
    /** @type {__VLS_StyleScopedClasses['toast']} */ ;
    (__VLS_ctx.game.toastMessage);
}
// @ts-ignore
[game, game,];
var __VLS_73;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
