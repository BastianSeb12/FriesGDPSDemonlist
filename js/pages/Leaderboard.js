import { fetchLeaderboard } from "../content.js";
import { localize, getFontColour } from "../util.js";

import Spinner from "../components/Spinner.js";
import { store } from '../main.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        profiles: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading" class="surface">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container surface">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="rank-image">
                                <img v-if="i + 1 == 1" class="trophy" src="assets/Top1Trophy.png" />
                                <img v-if="i + 1 == 2" class="trophy" src="assets/Top2Trophy.png" />
                                <img v-if="i + 1 == 3" class="trophy" src="assets/Top3Trophy.png" />
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container surface">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <div class="packs" v-if="entry.packs.length > 0">
                            <div v-for="pack in entry.packs" class="tag" :style="{background:pack.colour, color:getFontColour(pack.colour)}">
                                {{pack.name}}
                            </div>
                        </div>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table v-if="entry.verified.length > 0" class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table v-if="entry.completed.length > 0" class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table v-if="entry.progressed.length > 0" class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        store.leaderboard = this;
        await resetLeaderboard();
    },
    methods: {
        localize,
        getFontColour
    },
};

export async function resetLeaderboard() {
    store.leaderboard.loading = true;

    const [leaderboard, err] = await fetchLeaderboard();

    store.leaderboard.leaderboard = leaderboard;
    store.leaderboard.err = err;
    // Hide loading spinner
    store.leaderboard.loading = false;
}