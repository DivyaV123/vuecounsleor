import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios';
import { sessionStore } from './session'
import { themeStore } from "../stores/theme"

export const counselorStore = defineStore('counselor', {

    state: () => ({
        enquiries: [],
        branchRecords: [],
        allEnquiries: [],
        unpaidDrops:[],
        dropComments:[],    
        rigidEnquiries:[],
        weekendEnquiries:[],
        onlineBatches: [],
        noEnquiryForms: [],
        updateStatus: [],
        dataNotTaken: [],
        stars: [],
        otherBranch: [],
        esclatedToMe: [],
        esclatedByMe: [],
        esclatedByMeCount: 0,
        mode: [],
        classtiming: [],
        special_course: [],
        timeslot: [],
        highestdegree: [],
        followups: [],
        fEnqs:new Map(),
        inactiveFEnqs:new Map(),
        newFEnqs:new Map(),
        callbackFEnqs:new Map(),
        rnrFEnqs:new Map(),
        comingFEnqs:new Map(),
        swFEnqs:new Map(),
        obs:new Map(),
        courses: [],
        modeclass: [],
        branches: [],
        courseBranches: [],
        all_branches:[],
        degree: [],
        masters: [],

        streams: [],
        colleges: [],

        records: [],
        recordCount: 0,
        nrecords: [],
        nrecordCount: 0,
        eReasons: [],
        bUsers: [],
        EscUsers:[],
        rReasons: [],
        callStatus: [],
        singleRecord: [],
        categoryStatus: [],
        refers: [],
        roomBatch: {},
        refersInside: [],

        noCallEnquiry: [],

        formMessage: {
            show: true,
            message: ''
        },
        isEnquirySearchActive: false,
        nextBatch: [],
        nextBatchCount: 0,
        needOnline: [],

        missedCalls: [],
        unpaidDrops: [],
        onlineEnqs:[],
        peculiarEnqs: [],
        oBToMe: [],
        meToOB: [],
        meToOBCount: 0,
        reminders: [],
        remindersCount: 0,
        internals: [],
        internalsCount: 0,
        callBack: [],
        joinedSomewhere: [],
        alreadyJoined: [],
        coming: [],
        comingCount: 0,
        searchValues: false,
        formValues: false,
        gotJob: [],
        assign_branch:[],
        student:[],
        user_branch:[],
        branches_min:[],
        check_num:[],
        enq_followup:[],
        enq_dropout:[]

    }),
    actions: {
        async getGotJob(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const gotjob = await axios.get(`https://gotest.qspiders.com/api/counselor/get-got-job?page=${page}`, {
                        headers: headers
                    });
                    this.gotJob = gotjob.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async addGotJob(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-got-job`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async addCorporateComment(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-comment`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        // async getBranches() {
        //     if (this.branches.length === 0) {
        //         const user = sessionStore();
        //         const token = user.user.token
        //         if (token) {
        //             const headers = {
        //                 'Authorization': `Token ${token}`
        //             }
        //             try {
        //                 const branches = await axios.get(`https://counselor.qspiders.com/branches/branches-minimal/?per_page=200`, {
        //                     headers: headers
        //                 });
        //                 this.$patch({
        //                     branches: branches.data.results,
        //                 })

        //             }
        //             catch (err) {
        //                 console.log("errors", err)
        //             }
        //         }
        //     }
        // },
        async searchOpenclose() {
            this.isEnquirySearchActive = !this.isEnquirySearchActive
        },
        async getComing(page = 1) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const coming = await axios.get(`https://counselor.qspiders.com/counselor/coming/?page=${page}`, {
                        headers: headers
                    });
                    this.$patch({
                        coming: coming.data.results,
                        comingCount: coming.data.total,

                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getAlreadyJoined(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const alreadyjoined = await axios.get(`https://gotest.qspiders.com/api/counselor/get-already-joined?page=${page}`, {
                        headers: headers
                    });
                    this.alreadyJoined = alreadyjoined.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getJoinedSomewhere(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const joinedsomewhere = await axios.get(`https://gotest.qspiders.com/api/counselor/get-joined-somewhere?page=${page}`, {
                        headers: headers
                    });
                    this.joinedSomewhere = joinedsomewhere.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async addJoinedSomewhere(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-joined-somewhere`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async addAlreadyJoined(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-already-joined`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async addToMe(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-to-me`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async syncMe(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/sync-me`, form, { headers }).then(
                        function (response) {
                            return response.data
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async getOtherBranch() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const ob = await axios.get(`https://gotest.qspiders.com/api/counselor/other-branches?per_page=200`, {
                        headers: headers
                    });
                    this.otherBranch = ob.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async moveBranch(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/move-to-other-branch`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async getCallBack(page = 0, search) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const callback = await axios.get(`https://gotest.qspiders.com/api/counselor/get-call-back?page=${page}&${search}`, {
                        headers: headers
                    });
                    this.callBack = callback.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getInternals(page = 1) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const internals = await axios.get(`https://counselor.qspiders.com/commons2/internal-list/?page=${page}`, {
                        headers: headers
                    });
                    this.$patch({
                        internals: internals.data.results,
                        internalsCount: internals.data.total,

                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async addInternal(form) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const internal = await axios.post(`https://counselor.qspiders.com/commons2/add-internal-list/`, form, {
                        headers: headers
                    });

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getReminders(page = 1) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const reminders = await axios.get(`https://counselor.qspiders.com/commons2/reminder/?page=${page}`, {
                        headers: headers
                    });
                    this.$patch({
                        reminders: reminders.data.results,
                        remindersCount: reminders.data.total,

                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async setReminder(form) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const reminder = await axios.post(`https://counselor.qspiders.com/commons2/reminder/`, form, {
                        headers: headers
                    });
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async removeReminder(id) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const reminder = await axios.post(`https://counselor.qspiders.com/commons2/remove-reminder/`, id, {
                        headers: headers
                    });
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getMeToOB(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const metoob = await axios.get(`https://gotest.qspiders.com/api/counselor/other-branch-by-me?page=${page}`, {
                        headers: headers
                    });
                    this.meToOB = metoob.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getOBToMe(page = 0) {
            this.obs=new Map()
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const obtome = await axios.get(`https://gotest.qspiders.com/api/counselor/other-branch-to-me?page=${page}`, {
                        headers: headers
                    });
                    for(var i = 0;i<obtome.data.items.length;i++){
                        let ob=obtome.data.items[i]
                     this.obs.set(ob.id,ob)
                    }
                    this.oBToMe = obtome.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getOnlineEnq(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const online = await axios.get(`https://gotest.qspiders.com/api/counselor/online-courses?page=${page}`, {
                        headers: headers
                    });
                    this.onlineEnqs = online.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getPeculiarEnq(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const peculiar = await axios.get(`https://gotest.qspiders.com/api/counselor/peculiar-courses?page=${page}`, {
                        headers: headers
                    });
                    this.peculiarEnqs = peculiar.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getMissedCalls(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const missedcalls = await axios.get(`https://gotest.qspiders.com/api/counselor/get-missed-calls?page=${page}`, {
                        headers: headers
                    });
                    this.missedCalls = missedcalls.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getUnpaidDropouts(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const unpaidDrops = await axios.get(`https://gotest.qspiders.com/api/counselor/get-dropoutstudents?page=${page}`, {
                        headers: headers
                    });
                   
                    this.unpaidDrops = unpaidDrops.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getNeedOnline(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const needonline = await axios.get(`https://gotest.qspiders.com/api/counselor/need-online-followup?page=${page}`, {
                        headers: headers
                    });
                    this.needOnline = needonline.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getNextBatch(page = 1) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const nextbatch = await axios.get(`https://counselor.qspiders.com/counselor/status-next-batch/?page=${page}`, {
                        headers: headers
                    });
                    this.$patch({
                        nextBatch: nextbatch.data.results,
                        nextBatchCount: nextbatch.data.total,

                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async updateAgreedDate(form) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const nextbatch = await axios.post(`https://counselor.qspiders.com/counselor/update-agreed-date/`, form, {
                        headers: headers
                    });

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getClassTiming() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const classtiming = await axios.get(`https://gotest.qspiders.com/api/batch/classtiming?size=500`, {
                        headers: headers
                    });
                    this.classtiming = classtiming.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getSpecialCourse() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const classtiming = await axios.get(`https://gotest.qspiders.com/api/course/get-special-courses?size=500`, {
                        headers: headers
                    });
                    this.special_course = classtiming.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getTimeSlots() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const timeslot = await axios.get(`https://gotest.qspiders.com/api/batch/timeslots?size=500`, {
                        headers: headers
                    });
                    this.timeslot = timeslot.data.items.reverse()
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getCourses() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const courses = await axios.get(`https://gotest.qspiders.com/api/counselor/get-counselor-courses?size=500`, {
                        headers: headers
                    });
                    this.courses = courses.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getDropComments() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const comments = await axios.get(`https://gotest.qspiders.com/api/counselor/get-dropoutcomments`, {
                        headers: headers
                    });
                    this.dropComments = comments.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getModeClass() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const modeclass = await axios.get(`https://gotest.qspiders.com/api/batch/modeofclasses?size=500`, {
                        headers: headers
                    });
                    this.modeclass = modeclass.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getModeEnquiry() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const mode = await axios.get(`https://gotest.qspiders.com/api/counselor/get-modeofenq`, {
                        headers: headers
                    });
                    this.mode = mode.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getHighestDegree() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const highestdegree = await axios.get(`https://gotest.qspiders.com/api/users/qualifications?size=500`, {
                        headers: headers
                    });
                    this.highestdegree = highestdegree.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getFollowups(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const followups = await axios.get(`https://gotest.qspiders.com/api/counselor/new-follow-up?page=${page}`, {
                        headers: headers
                    });
                    this.followups = followups.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getBranches() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const branches = await axios.get(`https://gotest.qspiders.com/api/branch/branches?size=500`, {
                        headers: headers
                    });
                    this.branches = branches.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getdisablebranch() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const branches = await axios.get(`https://gotest.qspiders.com/api/users/get-branchesminimal?size=500`, {
                        headers: headers
                    });
                    this.branches_min = branches.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getCourseBranches(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const courseBranches = await axios.get(`https://gotest.qspiders.com/api/counselor/get-course-branches?name=${query}`, {
                        headers: headers
                    });
                    this.courseBranches = courseBranches.data
                    // return courseBranches.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getDegree() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const degree = await axios.get(`https://gotest.qspiders.com/api/users/degrees?size=500`, {
                        headers: headers
                    });
                    this.degree = degree.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getFormValues() {
            if (this.formValues == false) {
                const user = sessionStore();
                const token = user.user.token
                if (token) {
                    const headers = {
                        'Authorization': `Token ${token}`
                    }
                    try {
                        const values = await axios.get('https://counselor.qspiders.com/counselor/enquiry-form-values/', {
                            headers: headers
                        });
                        this.$patch({
                            mode: values.data.mode,
                            classtiming: values.data.classtiming,
                            timeslot: values.data.timeslot,
                            highestdegree: values.data.highestdegree,
                            courses: values.data.courses,
                            modeclass: values.data.modeclass,
                            branches: values.data.branches,
                            degree: values.data.degree,
                            masters: values.data.masters,
                            formValues: true
                        })

                    }
                    catch (err) {
                        console.log("errors", err)
                    }
                }
            }
        },
        async getSearchValues() {
            if (this.searchValues == false) {
                const user = sessionStore();
                const token = user.user.token
                if (token) {
                    const headers = {
                        'Authorization': `Token ${token}`
                    }
                    try {
                        const values = await axios.get('https://counselor.qspiders.com/counselor/enquiry-search-values/', {
                            headers: headers
                        });
                        this.$patch({
                            mode: values.data.mode,
                            classtiming: values.data.classtiming,
                            timeslot: values.data.timeslot,
                            highestdegree: values.data.highestdegree,
                            courses: values.data.courses,
                            searchValues: true
                        })

                    }
                    catch (err) {
                        console.log("errors", err)
                    }
                }
            }
        },
        async getAcademicValues() {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const values = await axios.get('https://counselor.qspiders.com/counselor/enquiry-academic-values/', {
                        headers: headers
                    });
                    this.$patch({
                        highestdegree: values.data.highestdegree,
                        degree: values.data.degree,
                        masters: values.data.masters,
                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getCourseValues() {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const values = await axios.get('https://counselor.qspiders.com/counselor/enquiry-course-values/?size=500', {
                        headers: headers
                    });
                    this.$patch({
                        courses: values.data.courses,
                        modeclass: values.data.modeclass,
                        branches: values.data.branches,
                    })

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getFERecordValues(id) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    if (id) {
                        const records = await axios.get(`https://counselor.qspiders.com/counselor/full-call-records-by-enquiry/?id=${id}`, {
                            headers: headers
                        });
                        this.records = records.data.results
                        this.recordCount = records.data.total
                    }
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getERecordValues(id) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    if (id) {
                        const records = await axios.get(`https://counselor.qspiders.com/counselor/call-records-by-enquiry/?id=${id}`, {
                            headers: headers
                        });
                        this.records = records.data.results
                        this.recordCount = records.data.total
                    }
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getFNRecordValues(number) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    if (number) {
                        const records = await axios.get(`https://counselor.qspiders.com/callrecord/full-call-records-by-number/?number=${number}`, {
                            headers: headers
                        });
                        // this.nrecords = records.data.results
                        this.nrecordCount = records.data.total
                    }
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getNRecordValues(page = 0, number) {
            // const num=encodeURIComponent(number)
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    if (number) {
                        const records = await axios.get(`https://gotest.qspiders.com/api/counselor/get-history?size=8&page=${page}&name=${number}`, {
                            headers: headers
                        });
                        this.nrecords = records.data
                    }
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getEReasons() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const reasons = await axios.get(`https://gotest.qspiders.com/api/admin/get-escalation-reason?size=500`, {
                        headers: headers
                    });
                    this.eReasons = reasons.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getBCounselors() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const busers = await axios.get(`https://gotest.qspiders.com/api/counselor/get-branch-counselors?size=500`, {
                        headers: headers
                    });
                    this.bUsers = busers.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getEscUsers(search,uid) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {

                    const busers = await axios.get(`https://gotest.qspiders.com/api/batch/get-all-cons-of-branch?bid=${search}&uid=${uid}`, {
                        headers: headers
                    });
                    this.EscUsers = busers.data

                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getRReasons() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const reasons = await axios.get(`https://gotest.qspiders.com/api/batch/get-reasons?size=500`, {
                        headers: headers
                    });
                    this.rReasons = reasons.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getCallStatus() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const status = await axios.get(`https://gotest.qspiders.com/api/counselor/get-main-status?size=500`, {
                        headers: headers
                    });
                    this.callStatus = status.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getRecord(rid) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const record = await axios.get(`https://gotest.qspiders.com/api/counselor/get-record?rid=${rid}`, {
                        headers: headers
                    });
                    this.singleRecord = record.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getStudentDetails(rid) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const record = await axios.get(`https://gotest.qspiders.com/api/opti/student-details?id=${rid}`, {
                        headers: headers
                    });

                    this.student = record.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getEnquiries(page = 0, search = "") {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const enquiries = await axios.get(`https://gotest.qspiders.com/api/counselor/enquiries?page=${page}${search}`, {
                        headers: headers
                    });
                    this.enquiries = enquiries.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getBranchRecords(page = 0, search = "") {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const recs = await axios.get(`https://gotest.qspiders.com/api/counselor/get-branch-calls?page=${page}${search}`, {
                        headers: headers
                    });
                    this.branchRecords = recs.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getFollowUpEnquiries(fp,type) {
            const user = sessionStore();
            // this.fEnqs = [] 
            // this.newFEnqs = [] 
            // this.inactiveFEnqs = []
            // this.callbackFEnqs = []
            // this.comingFEnqs = []

            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const enquiries = await axios.get(`https://gotest.qspiders.com/api/counselor/follow-up-enquiries?fp=${fp}&type=${type}`, {
                        headers: headers
                    });
                    if(enquiries.data.items && enquiries.data.items.length > 0){
                        for(var i = 0;i<enquiries.data.items.length;i++){
                            var courses = enquiries.data.items[i].courses
                            for(var m = 0;m<courses.length;m++){
                                if(courses[m].followup && courses[m].followup.length > 0){
                                var followup = courses[m].followup
                                for(var p = 0;p<followup.length;p++){
                                    if(followup[p].id == fp){
                                        var follow = followup[p]
                                        if(follow.type == 1 || follow.type == 2 || follow.type == 3){
                                            this.fEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                        }
                                        else if(follow.type == 4){
                                            this.inactiveFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                        }
                                        else if(follow.type == 5){
                                            this.newFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                        }
                                        else{
                                            this.fEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                        }
                                        if(follow.record && follow.record.status){
                                            if(follow.record.status.substatus.id == 2 ){
                                                this.callbackFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                            }
                                            if(follow.record.status.substatus.id == 4){
                                                this.comingFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                            }
                                            if(follow.record.status.substatus.id == 13){
                                                this.rnrFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                            }
                                            if(follow.record.status.substatus.id == 15){
                                                this.swFEnqs.set(enquiries.data.items[i].id,enquiries.data.items[i])
                                            }

                                        }
                                        
                                    }
                                }
                            }
                        }
                        }
                    }   
                    
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getAllEnquiries(page = 0, search = "") {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const enquiries = await axios.get(`https://gotest.qspiders.com/api/counselor/get-all-enquiries?page=${page}${search}`, {
                        headers: headers
                    });
                    this.allEnquiries = enquiries.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getUnpaidDropouts(page = 0, search = "") {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const students = await axios.get(`https://gotest.qspiders.com/api/counselor/get-dropoutstudents?status=3&page=${page}${search}`, {
                        headers: headers
                    });
                    this.unpaidDrops = students.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getRigidEnquiries(page = 0,search="") {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const rigidEnquiries = await axios.get(`https://gotest.qspiders.com/api/counselor/get-rigid-enquiries?page=${page}${search}`, {
                        headers: headers
                    });
                    this.rigidEnquiries = rigidEnquiries.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getWeekendEnquiries(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const weekendEnquiries = await axios.get(`https://gotest.qspiders.com/api/counselor/get-weekend-enquiries?page=${page}`, {
                        headers: headers
                    });
                    this.weekendEnquiries = weekendEnquiries.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getOnlineBatches(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const onlineBatches = await axios.get(`https://gotest.qspiders.com/api/counselor/get-online-batches?page=${page}`, {
                        headers: headers
                    });
                    // console.log("btachessss------",onlineBatches.data );
                    this.onlineBatches = onlineBatches.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getNoEnquiryForm(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const calls = await axios.get(`https://gotest.qspiders.com/api/counselor/get-no-enquiry-form?page=${page}`, {
                        headers: headers
                    });
                    this.noEnquiryForms = calls.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getUpdateStatus(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const calls = await axios.get(`https://gotest.qspiders.com/api/counselor/get-no-status?page=${page}`, {
                        headers: headers
                    });
                    this.updateStatus = calls.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getDataNotTaken(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const enqs = await axios.get(`https://gotest.qspiders.com/api/counselor/get-data-not-taken?page=${page}`, {
                        headers: headers
                    });
                    this.dataNotTaken = enqs.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getStars(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const stars = await axios.get(`https://gotest.qspiders.com/api/counselor/get-stars?page=${page}`, {
                        headers: headers
                    });
                    this.stars = stars.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getEscalatedToMe(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const enqs = await axios.get(`https://gotest.qspiders.com/api/counselor/get-counselor-esalations?page=${page}`, {
                        headers: headers
                    });
                    this.esclatedToMe = enqs.data

                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getEscalatedByMe(page = 1) {
            const user = sessionStore();
            const token = user.user.token
            if (token) {
                const headers = {
                    'Authorization': `Token ${token}`
                }
                try {
                    const enqs = await axios.get(`https://counselor.qspiders.com/counselor/escalated-by-me/?page=${page}`, {
                        headers: headers
                    });
                    this.esclatedByMe = enqs.data.results
                    this.esclatedByMeCount = enqs.data.total

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getStreams(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const streams = await axios.get(`https://gotest.qspiders.com/api/users/streams?${query}`, {
                        headers: headers
                    });
                    this.streams = streams.data
                    return streams.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getColleges(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const colleges = await axios.get(`https://gotest.qspiders.com/api/users/colleges?size=10&${query}`, {
                        headers: headers
                    });
                    // this.colleges = colleges.data
                    return colleges.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getReferrals(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const refers = await axios.get(`https://gotest.qspiders.com/api/counselor/referrals?page=${page}`, {
                        headers: headers
                    });
                    this.refers = refers.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getReferralsInside(query, page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const refers = await axios.get(`https://gotest.qspiders.com/api/counselor/referrals-list?page=${page}&${query}`, {
                        headers: headers
                    });
                    this.refersInside = refers.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getNoCallsEnquiry(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const ncs = await axios.get(`https://gotest.qspiders.com/api/counselor/no-calls-enquiries?page=${page}`, {
                        headers: headers
                    });
                    this.noCallEnquiry = ncs.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getAllBranches(page = 0) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const branch = await axios.get(`https://gotest.qspiders.com/api/users/get-allbranches?page=${page}`, {
                        headers: headers
                    });
                    this.all_branches = branch.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async submitEnquiry(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-enquiry`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitAcademic(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-data-not-taken`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitContact(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-contact`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitEmail(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-email`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitCourse(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/add-course', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitEscalate(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/add-counselor-escalation', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitRemove(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/remove-enquiry', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitOnline(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/need-online`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitChangeStatus(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/update-status', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async submitAddStatus(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/update-status', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async AddDropoutStatus(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/add-dropoutcomments', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async unStar(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/un-star', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async get_single_batch(id) {
            const user = sessionStore();
            const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {
                    const batch = await axios.get(`https://gotest.qspiders.com/api/online/get-single-batch?name=${id}`, {
                        headers: headers
                    });
                    this.roomBatch = batch.data

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async add_trainer_attendance(data) {
            const user = sessionStore();
            const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {
                    await axios.post(`https://gotest.qspiders.com/api/online/add-userattendance`, data,{
                        headers: headers
                    });

                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
      
        async add_comment(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/add-comment', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async misscall_comment(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/cvs/misscall-comment', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        async add_esccomment(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post('https://gotest.qspiders.com/api/counselor/esc-add-comment', form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },
        // user assigned branch
        async getuserassignbranch() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const rn = await axios.get(`https://gotest.qspiders.com/api/user/assigned-branches`, {
                        headers: headers
                    });
                    this.assign_branch =  rn.data.result
                  
                }
                catch (err) {
                    console.log("errors", err)
                }
            
            // }
          }
          
          },
          async getuserBranchRecords(page=0,search) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const rn = await axios.get(`https://gotest.qspiders.com/api/counselor/records-of-counselor?page=${page}&${search}`, {
                        headers: headers
                    });
                    this.user_branch =  rn.data
                  
                }
                catch (err) {
                    console.log("errors", err)
                }
            
            // }
          }
          
          },
          async postcheckdata(data) {
            const user = sessionStore();
            const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {
                   const response= await axios.post(`https://gotest.qspiders.com/api/counselor/check-number`, data,{
                        headers: headers
                    });
                    this.check_num = response.data
                    return this.check_num
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        }, 
        async getEnqFollowup(page=0,search) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const rn = await axios.get(` https://gotest.qspiders.com/api/counselor/enquiry-followup-list?page=${page}`, {
                        headers: headers
                    });
                    this.enq_followup =  rn.data
                  
                }
                catch (err) {
                    console.log("errors", err)
                }
            // }
          }
          
          },
          async getEnqDropout(page=0,search) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const rn = await axios.get(`
                    https://gotest.qspiders.com/api/counselor/enquiry-dropout-counselor?page=${page}
                    `, {
                        headers: headers
                    });
                    this.enq_dropout =  rn.data
                  
                }
                catch (err) {
                    console.log("errors", err)
                }
            // }
          }
          
          },
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(counselorStore, import.meta.hot))
}