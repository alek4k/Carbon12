/**
 * File name: view.js
 * Date: 2020-03-18
 *
 * @file Script principale del programma di addestramento
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version X.Y.Z
 *
 * Changelog: modifiche effettuate
 */

import View from '../../../src/utils/view';

describe('Testing constructor', () => {
    it('with type Indicatore', () => {
        const view = new View('Indicatore', 'TestPanelI', 0, 'cpu');
        expect(view.type).toEqual('Indicatore');
        expect(view.title).toEqual('TestPanelI');
        expect(view.id).toEqual(0);
        expect(view.dataSource).toEqual('cpu');
        expect(view.dashboard).toEqual({
            colors: [
                '#d44a3a',
                'rgba(237, 129, 40, 0.89)',
                '#299c46',
            ],
            gridPos: {},
            id: view.id,
            targets: [],
            valueMaps: [{
                op: '=',
                text: 'Good &#128077;',
                value: '1',
            },
            {
                op: '=',
                text: 'Bad &#128078;',
                value: '-1',
            }],
            valueName: 'current',
        });
    });

    it('with type Grafico', () => {
        const view = new View('Grafico', 'TestPanelG', 0, 'cpu');
        expect(view.type).toEqual('Grafico');
        expect(view.title).toEqual('TestPanelG');
        expect(view.id).toEqual(0);
        expect(view.dataSource).toEqual('cpu');
        expect(view.dashboard).toEqual({
            colors: [
                '#d44a3a',
                'rgba(237, 129, 40, 0.89)',
                '#299c46',
            ],
            gridPos: {},
            id: view.id,
            targets: [],
            valueMaps: [{
                op: '=',
                text: 'Good &#128077;',
                value: '1',
            },
            {
                op: '=',
                text: 'Bad &#128078;',
                value: '-1',
            }],
            valueName: 'current',
        });
    });
});

describe('Testing method', () => {
    let view = null;
    beforeEach(() => {
        view = new View('Indicatore', 'TestPanelI', 0, 'cpu');
    });

    afterEach(() => {
        view = null;
    });

    it('setType', () => {
        const newType = 'Grafico';
        view.setType(newType);
        expect(view.type).toEqual(newType);
    });

    it('setTitle', () => {
        const newTitle = 'Test title';
        view.setTitle(newTitle);
        expect(view.title).toEqual(newTitle);
    });

    it('setId', () => {
        const newId = 1;
        view.setId(newId);
        expect(view.id).toEqual(newId);
    });

    it('setDescription', () => {
        const newDescription = 'Test description';
        view.setDescription(newDescription);
        expect(view.description).toEqual(newDescription);
    });

    it('setBackground', () => {
        const newBackground = 'true';
        view.setBackground(newBackground);
        expect(view.background).toEqual(newBackground);
    });

    it('getType', () => {
        view.type = 'Indicatore';
        expect(view.getType()).toEqual(view.type);
    });

    it('getTitle', () => {
        view.title = 'Test title';
        expect(view.getTitle()).toEqual(view.title);
    });

    it('getId', () => {
        view.id = 3;
        expect(view.getId()).toEqual(view.id);
    });

    it('getDescription', () => {
        view.description = 'Test description';
        expect(view.getDescription()).toEqual(view.description);
    });

    it('getBackground', () => {
        view.background = 'false';
        expect(view.getBackground()).toEqual(view.background);
    });

    describe('getJSON', () => {
        it('with type Grafico', () => {
            view.type = 'Grafico';
            expect(view.getJSON()).toEqual({
                colors: ['#d44a3a', 'rgba(237, 129, 40, 0.89)', '#299c46'],
                gridPos: { h: 8, w: 12 },
                id: view.id,
                targets: [],
                valueMaps: [
                    { op: '=', text: 'Good &#128077;', value: '1' },
                    { op: '=', text: 'Bad &#128078;', value: '-1' },
                ],
                valueName: 'current',
                type: 'graph',
                title: view.title
                    ? view.title : 'Grafico di Predizione ' + view.id,
                description: view.description ? view.description : '',
                datasource: view.dataSource,
            });
        });

        it('with type Indicatore', () => {
            view.type = 'Indicatore';
            expect(view.getJSON()).toEqual({
                colors: ['#d44a3a', 'rgba(237, 129, 40, 0.89)', '#299c46'],
                gridPos: { h: 4, w: 4 },
                id: view.id,
                targets: [],
                valueMaps: [
                    { op: '=', text: 'Good &#128077;', value: '1' },
                    { op: '=', text: 'Bad &#128078;', value: '-1' },
                ],
                valueName: 'current',
                type: 'singlestat',
                thresholds: '0, 0.5',
                title: view.title
                    ? view.title : 'Indicatore di Predizione ' + view.id,
                description: view.description ? view.description : '',
                colorBackground: view.background,
                datasource: view.dataSource,
            });
        });
    });
});
