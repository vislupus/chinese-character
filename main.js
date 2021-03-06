var app = new Vue({
    el: '#app',
    data: {
        characters: charactersData,
        characterAdd: '',
        englishAdd: '',
        groupAdd: '',
        characterUpdate: '',
        englishUpdate: '',
        groupUpdate: '',
        seenDictionary: true,
        seenQuiz: false,
        seenScore: false,
        seenTable: false,
        seenAdd: false,
        n: 1,
        updateId: 0,
        search: '',
        searchSelect: 'English',
        stopAdd_character: false,
        stopAdd_english: false,
        stopAdd_group: false,
        stopAdd_both: false,
        uniqueGroups: [],
        seenQuizTitle: true,
        seenQuizGroups: true,
        seenQuizProblem: false,
        nAns: 0,
        answers: 0,
        colorCorr: '#85e085',
        colorWrong: '#ff6666',
        colorNeu: '#cce6ff',
    },
    methods: {
        addData() {
            this.seenAdd = true;
            this.seenTable = false;
        },
        addExit() {
            this.seenAdd = false;
        },
        addRow(event) {
            this.stopAdd_character = false;
            this.stopAdd_english = false;
            this.stopAdd_group = false;
            this.stopAdd_both = false;

            this.englishAdd = this.$refs.add.$refs.english.value;
            this.characterAdd = this.$refs.add.$refs.character.value;
            this.groupAdd = this.$refs.add.$refs.group.value;

            for (let i = 0; i < this.characters.length; i++) {
                if (this.characterAdd == '') {
                    this.stopAdd_character = true;
                    this.$refs.add.$refs.character.style.border = '1px solid red';
                }

                if (this.englishAdd == '') {
                    this.stopAdd_english = true;
                    this.$refs.add.$refs.english.style.border = '1px solid red';
                }

                if (this.englishAdd == this.characters[i].english && this.characterAdd == this.characters[i].character) {
                    this.stopAdd_both = true;
                    this.$refs.add.$refs.english.style.border = '1px solid red';
                    this.$refs.add.$refs.character.style.border = '1px solid red';
                }

                if (this.groupAdd == '') {
                    this.stopAdd_group = true;
                    this.$refs.add.$refs.group.style.border = '1px solid red';
                }
            }


            if (!this.stopAdd_character && !this.stopAdd_both) this.$refs.add.$refs.character.style.border = '1px solid #A9A9A9';
            if (!this.stopAdd_english && !this.stopAdd_both) this.$refs.add.$refs.english.style.border = '1px solid #A9A9A9';
            if (!this.stopAdd_group) this.$refs.add.$refs.group.style.border = '1px solid #A9A9A9';

            if (!this.stopAdd_character && !this.stopAdd_english && !this.stopAdd_group && !this.stopAdd_both) {
                if (this.characters.length > 0) {
                    this.n = this.characters[this.characters.length - 1].id + 1;
                }

                this.characters.push({
                    id: this.n,
                    character: this.characterAdd,
                    english: this.englishAdd,
                    group: this.groupAdd
                });

                this.characterAdd = '';
                this.englishAdd = '';
                this.groupAdd = '';

                this.seenAdd = false;
            }
        },
        deleteRow(id) {
            this.characters.splice(this.characters.findIndex(obj => obj.id == id), 1);
        },
        updateRow(id) {
            this.seenTable = true;
            this.seenAdd = false;
            this.updateId = id;

            this.$nextTick(function () {
                this.$refs.upd.$refs.update_form.style.display = 'block';
                if (this.search != '') {
                    this.$refs.upd.$refs.update_form.style.marginTop = event.target.getBoundingClientRect().top + window.scrollY + 'px';
                } else {
                    this.$refs.upd.$refs.update_form.style.marginTop = this.$refs.update[id - 1].getBoundingClientRect().top + window.scrollY + 'px';
                }
            });

            this.characterUpdate = this.characters[id - 1].character;
            this.englishUpdate = this.characters[id - 1].english;
            this.groupUpdate = this.characters[id - 1].group;
        },
        updateButton() {
            this.seenTable = false;

            this.characterUpdate = this.$refs.upd.$refs.character.value;
            this.englishUpdate = this.$refs.upd.$refs.english.value;
            this.groupUpdate = this.$refs.upd.$refs.group.value;

            this.characters[this.updateId - 1].character = this.characterUpdate;
            this.characters[this.updateId - 1].english = this.englishUpdate;
            this.characters[this.updateId - 1].group = this.groupUpdate;
        },
        updateExit() {
            this.seenTable = false;
        },
        navMenu(id) {
            this.seenDictionary = false;
            this.seenQuiz = false;
            this.seenScore = false;

            this.seenTable = false;
            this.seenAdd = false;

            if (id == 'dictionary') {
                this.seenDictionary = true;
            } else if (id == 'quiz') {
                this.seenQuiz = true;
            } else if (id == 'score') {
                this.seenScore = true;
            }
        },
        quiz(id) {
            //                    console.log('group: ' + id)

            this.problemArray = this.characters.filter(function (obj) {
                return obj.group === id;
            });

            this.generateCorrect(this.problemArray);

            this.seenQuizTitle = false;
            this.seenQuizGroups = false;
        },
        generateCorrect(problemArray) {
            this.randomLanguage = this.random(0, 2);
            this.randomAns = this.random(0, problemArray.length);
            this.array = [];
            for (let i = 0; i < problemArray.length; i++) {
                if (this.randomLanguage == 0) {
                    this.array.push(problemArray[i].english)
                } else {
                    this.array.push(problemArray[i].character)
                }
            }

            if (this.randomLanguage == 0) {
                this.problem = problemArray[this.randomAns].character;
                this.answare = problemArray[this.randomAns].english;
            } else {
                this.problem = problemArray[this.randomAns].english;
                this.answare = problemArray[this.randomAns].character;
            }

            //                    console.log(this.problem)
            //                    console.log(this.answare)

            this.array.splice(this.array.indexOf(this.answare), 1);

            this.nAns = this.random(1, 5);
            this.seenQuizProblem = true;
        },
        correctNum(n, v) {
            if (v == n) {
                return true;
            } else {
                return false;
            }
        },
        diffNumbers(n, v) {
            if (v == n) {
                return this.answare;
            } else {
                this.wrongN = this.random(0, this.array.length);
                this.wrong = this.array[this.wrongN];
                this.array.splice(this.wrongN, 1);

                return this.wrong;
            }
        },
        check(text) {
            //                    console.log(text)
            let target = event.target;

            if (text) {
                target.style.backgroundColor = this.colorCorr;

                for (i in this.characters) {
                    if (this.characters[i].character == this.problem || this.characters[i].english == this.problem) {
                        this.characters[this.characters[i].id - 1].correct++;
                    }
                }

                setTimeout(() => {
                    this.seenQuizProblem = false;
                    target.style.backgroundColor = this.colorNeu;

                    this.generateCorrect(this.problemArray);
                    this.answers++;

                    if (this.answers >= 10) {
                        this.seenQuizTitle = true;
                        this.seenQuizGroups = true;

                        this.seenQuizProblem = false;
                        this.answers = 0;
                    }
                }, 1000);
            } else {
                target.style.backgroundColor = this.colorWrong;

                for (i in this.characters) {
                    if (this.characters[i].character == this.problem || this.characters[i].english == this.problem) {
                        this.characters[this.characters[i].id - 1].wrong++;
                    }
                }

                setTimeout(() => {
                    target.style.backgroundColor = this.colorNeu;
                }, 1000);
            }
        },
        random(min, max) {
            var range = max - min;
            if (range <= 0) {
                throw new Exception('max must be larger than min');
            }
            var requestBytes = Math.ceil(Math.log2(range) / 8);
            if (!requestBytes) {
                return min;
            }
            var maxNum = Math.pow(256, requestBytes);
            var ar = new Uint8Array(requestBytes);

            while (true) {
                window.crypto.getRandomValues(ar);

                var val = 0;
                for (var i = 0; i < requestBytes; i++) {
                    val = (val << 8) + ar[i];
                }

                if (val < maxNum - maxNum % range) {
                    return min + (val % range);
                }
            }
        },
        totalScore(i) {
            if (i.correct / (i.correct + i.wrong)) {
                return (i.correct / (i.correct + i.wrong)*100).toFixed(0);
            } else {
                return 0;
            }
        }
    },
    computed: {
        filteredCharacters() {
            if (this.search) {
                this.seenTable = false;
                this.seenAdd = false;

                return this.characters.filter((item) => {
                    if (this.searchSelect == 'Group') {
                        return item.group.toLowerCase().includes(this.search.toLowerCase());
                    } else if (this.searchSelect == 'Character') {
                        return item.character.toLowerCase().includes(this.search.toLowerCase());
                    } else {
                        return item.english.toLowerCase().includes(this.search.toLowerCase());
                    }

                });
            } else {
                return this.characters;
            }
        },
        uniqueValues() {
            this.uniqueGroups = this.characters.map(item => item.group).filter((value, index, self) => {
                return self.indexOf(value) === index
            });

            this.uniqueGroupsCount = this.characters.reduce((acc, item) => (acc[item.group] = (acc[item.group] || 0) + 1, acc), {});

            return this.uniqueGroups;
        }
    }
});
