/**
 * File name: view.test.js
 * Date: 2020-04-27
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

import View from '../../../src/utils/view';

describe('Testing constructor', () => {
    it('with type Indicatore', () => {
        const view = new View('Indicatore', 'TestPanelI', 0);
        expect(view).toEqual({
            type: 'Indicatore',
            title: 'TestPanelI',
            id: 0,
            viewSettings: {
                gridPos: {},
                id: 0,
                targets: [],
                valueName: 'current',
            },
        });
    });

    it('with type Grafico', () => {
        const view = new View('Grafico', 'TestPanelG', 0);
        expect(view).toEqual({
            type: 'Grafico',
            title: 'TestPanelG',
            id: 0,
            viewSettings: {
                gridPos: {},
                id: 0,
                targets: [],
                valueName: 'current',
            },
        });
    });
});

describe('Testing method', () => {
    let view = null;
    beforeEach(() => {
        view = new (function testView() { })();
    });

    afterEach(() => {
        view = null;
    });

    describe('setType', () => {
        beforeEach(() => {
            view.setType = View.prototype.setType;
        });

        it('passing the parameter', () => {
            const parType = 'Grafico';
            view.setType(parType);

            expect(view).toEqual({
                setType: View.prototype.setType,
                type: parType,
            });
        });

        it('without passing the parameter', () => {
            view.setType();

            expect(view).toEqual({
                setType: View.prototype.setType,
            });
        });
    });

    describe('setTitle', () => {
        beforeEach(() => {
            view.setTitle = View.prototype.setTitle;
        });

        it('passing the parameter', () => {
            const parTitle = 'Test title';
            view.setTitle(parTitle);

            expect(view).toEqual({
                setTitle: View.prototype.setTitle,
                title: parTitle,
            });
        });

        it('without passing the parameter', () => {
            view.setTitle();

            expect(view).toEqual({
                setTitle: View.prototype.setTitle,
            });
        });
    });

    describe('setId', () => {
        beforeEach(() => {
            view.setId = View.prototype.setId;
        });

        it('passing the parameter', () => {
            const parId = 1;
            view.setId(parId);

            expect(view).toEqual({
                setId: View.prototype.setId,
                id: parId,
            });
        });

        it('without passing the parameter', () => {
            view.setId();

            expect(view).toEqual({
                setId: View.prototype.setId,
            });
        });
    });

    describe('setDataSource', () => {
        beforeEach(() => {
            view.setDataSource = View.prototype.setDataSource;
        });

        it('passing the parameter', () => {
            const parDataSource = {};
            view.setDataSource(parDataSource);

            expect(view).toEqual({
                setDataSource: View.prototype.setDataSource,
                dataSource: parDataSource,
            });
        });

        it('without passing the parameter', () => {
            view.setDataSource();

            expect(view).toEqual({
                setDataSource: View.prototype.setDataSource,
            });
        });
    });

    describe('setDescription', () => {
        beforeEach(() => {
            view.setDescription = View.prototype.setDescription;
        });

        it('passing the parameter', () => {
            const parDescription = 'Test description';
            view.setDescription(parDescription);

            expect(view).toEqual({
                setDescription: View.prototype.setDescription,
                description: parDescription,
            });
        });

        it('without passing the parameter', () => {
            view.setDescription();

            expect(view).toEqual({
                setDescription: View.prototype.setDescription,
            });
        });
    });

    it('setBackground', () => {
        view.setDefaultBackground = View.prototype.setDefaultBackground;
        view.viewSettings = {};

        view.setDefaultBackground();

        expect(view).toEqual({
            setDefaultBackground: View.prototype.setDefaultBackground,
            viewSettings: {
                colors: [
                    '#d44a3a',
                    'rgba(237, 129, 40, 0.89)',
                    '#299c46',
                ],
                thresholds: '0, 0',
                valueMaps: [{
                    op: '=',
                    text: 'Good &#128077;',
                    value: '1',
                }, {
                    op: '=',
                    text: 'Bad &#128078;',
                    value: '-1',
                }],
            },
        });
    });

    it('getType', () => {
        view.getType = View.prototype.getType;
        view.type = 'Indicatore';

        expect(view.getType()).toEqual(view.type);
        expect(view).toEqual({
            getType: View.prototype.getType,
            type: 'Indicatore',
        });
    });

    it('getTitle', () => {
        view.getTitle = View.prototype.getTitle;
        view.title = 'Test title';

        expect(view.getTitle()).toEqual(view.title);
        expect(view).toEqual({
            getTitle: View.prototype.getTitle,
            title: 'Test title',
        });
    });

    it('getId', () => {
        view.getId = View.prototype.getId;
        view.id = 3;

        expect(view.getId()).toEqual(view.id);
        expect(view).toEqual({
            getId: View.prototype.getId,
            id: 3,
        });
    });

    it('getDataSource', () => {
        view.getDataSource = View.prototype.getDataSource;
        view.dataSource = {};

        expect(view.getDataSource()).toEqual(view.dataSource);
        expect(view).toEqual({
            getDataSource: View.prototype.getDataSource,
            dataSource: {},
        });
    });

    it('getDescription', () => {
        view.getDescription = View.prototype.getDescription;
        view.description = 'Test description';

        expect(view.getDescription()).toEqual(view.description);
        expect(view).toEqual({
            getDescription: View.prototype.getDescription,
            description: 'Test description',
        });
    });

    describe('getJSON', () => {
        beforeEach(() => {
            view.getJSON = View.prototype.getJSON;
            view.viewSettings = {
                gridPos: {},
            };
            view.dataSource = {};
        });

        describe('with description defined', () => {
            beforeEach(() => {
                view.description = 'TestDescription';
            });

            describe('with type Grafico', () => {
                beforeEach(() => {
                    view.type = 'Grafico';
                });

                it('with a title', () => {
                    view.title = 'TestTitle';

                    expect(view.getJSON()).toEqual({
                        gridPos: { h: 8, w: 12 },
                        type: 'graph',
                        title: 'TestTitle',
                        description: 'TestDescription',
                        datasource: {},
                    });
                    expect(view).toEqual({
                        getJSON: View.prototype.getJSON,
                        type: 'Grafico',
                        title: 'TestTitle',
                        dataSource: {},
                        description: 'TestDescription',
                        viewSettings: {
                            gridPos: { h: 8, w: 12 },
                            type: 'graph',
                            title: 'TestTitle',
                            description: 'TestDescription',
                            datasource: {},
                        },
                    });
                });

                it('without a title', () => {
                    view.id = 0;

                    expect(view.getJSON()).toEqual({
                        gridPos: { h: 8, w: 12 },
                        type: 'graph',
                        title: 'Grafico di Predizione ' + 0,
                        description: 'TestDescription',
                        datasource: {},
                    });
                    expect(view).toEqual({
                        getJSON: View.prototype.getJSON,
                        type: 'Grafico',
                        id: 0,
                        dataSource: {},
                        description: 'TestDescription',
                        viewSettings: {
                            gridPos: { h: 8, w: 12 },
                            type: 'graph',
                            title: 'Grafico di Predizione ' + 0,
                            description: 'TestDescription',
                            datasource: {},
                        },
                    });
                });
            });

            describe('with type Indicatore', () => {
                beforeEach(() => {
                    view.type = 'Indicatore';
                });

                describe('with a title', () => {
                    beforeEach(() => {
                        view.title = 'TestTitle';
                    });

                    it('with thresholds defined', () => {
                        view.viewSettings.thresholds = {};

                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'TestTitle',
                            description: 'TestDescription',
                            colorBackground: true,
                            datasource: {},
                            thresholds: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            title: 'TestTitle',
                            dataSource: {},
                            description: 'TestDescription',
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'TestTitle',
                                description: 'TestDescription',
                                colorBackground: true,
                                datasource: {},
                                thresholds: {},
                            },
                        });
                    });

                    it('with thresholds undefined', () => {
                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'TestTitle',
                            description: 'TestDescription',
                            colorBackground: false,
                            datasource: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            title: 'TestTitle',
                            dataSource: {},
                            description: 'TestDescription',
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'TestTitle',
                                description: 'TestDescription',
                                colorBackground: false,
                                datasource: {},
                            },
                        });
                    });
                });

                describe('without a title', () => {
                    beforeEach(() => {
                        view.id = 0;
                    });

                    it('with thresholds defined', () => {
                        view.viewSettings.thresholds = {};

                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'Indicatore di Predizione 0',
                            description: 'TestDescription',
                            colorBackground: true,
                            datasource: {},
                            thresholds: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            dataSource: {},
                            id: 0,
                            description: 'TestDescription',
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'Indicatore di Predizione 0',
                                description: 'TestDescription',
                                colorBackground: true,
                                datasource: {},
                                thresholds: {},
                            },
                        });
                    });

                    it('with thresholds undefined', () => {
                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'Indicatore di Predizione 0',
                            description: 'TestDescription',
                            colorBackground: false,
                            datasource: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            dataSource: {},
                            id: 0,
                            description: 'TestDescription',
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'Indicatore di Predizione 0',
                                description: 'TestDescription',
                                colorBackground: false,
                                datasource: {},
                            },
                        });
                    });
                });
            });
        });

        describe('with description undefined', () => {
            describe('with type Grafico', () => {
                beforeEach(() => {
                    view.type = 'Grafico';
                });

                it('with a title', () => {
                    view.title = 'TestTitle';

                    expect(view.getJSON()).toEqual({
                        gridPos: { h: 8, w: 12 },
                        type: 'graph',
                        title: 'TestTitle',
                        description: '',
                        datasource: {},
                    });
                    expect(view).toEqual({
                        getJSON: View.prototype.getJSON,
                        type: 'Grafico',
                        title: 'TestTitle',
                        dataSource: {},
                        viewSettings: {
                            gridPos: { h: 8, w: 12 },
                            type: 'graph',
                            title: 'TestTitle',
                            description: '',
                            datasource: {},
                        },
                    });
                });

                it('without a title', () => {
                    view.id = 0;

                    expect(view.getJSON()).toEqual({
                        gridPos: { h: 8, w: 12 },
                        type: 'graph',
                        title: 'Grafico di Predizione ' + 0,
                        description: '',
                        datasource: {},
                    });
                    expect(view).toEqual({
                        getJSON: View.prototype.getJSON,
                        type: 'Grafico',
                        id: 0,
                        dataSource: {},
                        viewSettings: {
                            gridPos: { h: 8, w: 12 },
                            type: 'graph',
                            title: 'Grafico di Predizione ' + 0,
                            description: '',
                            datasource: {},
                        },
                    });
                });
            });

            describe('with type Indicatore', () => {
                beforeEach(() => {
                    view.type = 'Indicatore';
                });

                describe('with a title', () => {
                    beforeEach(() => {
                        view.title = 'TestTitle';
                    });

                    it('with thresholds defined', () => {
                        view.viewSettings.thresholds = {};

                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'TestTitle',
                            description: '',
                            colorBackground: true,
                            datasource: {},
                            thresholds: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            title: 'TestTitle',
                            dataSource: {},
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'TestTitle',
                                description: '',
                                colorBackground: true,
                                datasource: {},
                                thresholds: {},
                            },
                        });
                    });

                    it('with thresholds undefined', () => {
                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'TestTitle',
                            description: '',
                            colorBackground: false,
                            datasource: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            title: 'TestTitle',
                            dataSource: {},
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'TestTitle',
                                description: '',
                                colorBackground: false,
                                datasource: {},
                            },
                        });
                    });
                });

                describe('without a title', () => {
                    beforeEach(() => {
                        view.id = 0;
                    });

                    it('with thresholds defined', () => {
                        view.viewSettings.thresholds = {};

                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'Indicatore di Predizione 0',
                            description: '',
                            colorBackground: true,
                            datasource: {},
                            thresholds: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            dataSource: {},
                            id: 0,
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'Indicatore di Predizione 0',
                                description: '',
                                colorBackground: true,
                                datasource: {},
                                thresholds: {},
                            },
                        });
                    });

                    it('with thresholds undefined', () => {
                        expect(view.getJSON()).toEqual({
                            gridPos: { h: 4, w: 4 },
                            type: 'singlestat',
                            title: 'Indicatore di Predizione 0',
                            description: '',
                            colorBackground: false,
                            datasource: {},
                        });
                        expect(view).toEqual({
                            getJSON: View.prototype.getJSON,
                            type: 'Indicatore',
                            dataSource: {},
                            id: 0,
                            viewSettings: {
                                gridPos: { h: 4, w: 4 },
                                type: 'singlestat',
                                title: 'Indicatore di Predizione 0',
                                description: '',
                                colorBackground: false,
                                datasource: {},
                            },
                        });
                    });
                });
            });
        });
    });
});
