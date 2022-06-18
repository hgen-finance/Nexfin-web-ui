// Import Typed
import {
    getAccessorType,
    mutationTree,
    actionTree,
    getterTree,
} from "typed-vuex";

// type of notificationstx
export type Notificationtx = {
    txId?: string;
    id?: number;
    type: "fail" | "success" | "confirm";
    title: string;
    description?: string;
    show: boolean;
};

// State
export const state = () => ({
    notifications: [],
    // TODO: set the max limit for the notification
    counterId: 0, // increment when new notification is added
    totalNotificaitons: 0,
    clearTime: 5000,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setNotifications(state, newValue: Notificationtx) {
        state.notifications = [...state.notifications, newValue];
    },
    setClearNotifications(state) {
        state.notifications = [];
    },
    setCounterId(state, newValue: number) {
        state.counterId = newValue;
    },
    setTotalNotification(state, value) {
        state.totalNotificaitons = value
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        async increaseCounterId({ state, commit }) {
            commit("setCounterId", state.counterId + 1);

        },

        clearNotifications({ state, commit }) {
            let clearNotTx;
            if (state.notifications.length > 0) {
                commit("setClearNotifications");
            }
        },

        async notify({ state, commit, dispatch }, value) {
            const newNotiifcation: Notificationtx = {
                id: state.counterId,
                type: "success",
                description: null,
                show: true,
                ...value,
            };
            commit("setNotifications", newNotiifcation);
            commit("setTotalNotification", state.notifications.length)

            // increase the counterid by 1, everything time this action is called
            dispatch("notification/increaseCounterId", null, { root: true });

            // clear the tx after 3 secs
            setTimeout(() => {
                dispatch("notification/clearNotifications", null, { root: true });
                commit("setTotalNotification", 0)
            }, state.clearTime)


        },
    }
);
