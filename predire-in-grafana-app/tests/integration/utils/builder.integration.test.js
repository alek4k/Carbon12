/**
 * File name: builder.js
 * Date: 2020-03-20
 *
 * @file Classe che costruisce il target e la view del pannello
 * @author Carbon12 <carbon.dodici@gmail.com>
 * @version 1.4.0
 *
 * Changelog: modifiche effettuate
 */

/* eslint-disable import/named */
import Builder from '../../../src/utils/builder';
import Target from '../../../src/utils/target';
import View from '../../../src/utils/view';

describe('Testing method', () => {
    let oldConfig;
    let builder = null;
    beforeEach(() => {
        oldConfig = {
            id: 5,
            type: 'Grafico',
            title: 'TestBuilder',
            description: 'TestBuilderDescription',
            dataSource: 'TestDatasource',
        };

        const config = {
            id: 5,
            type: 'Grafico',
            title: 'TestBuilder',
            description: 'TestBuilderDescription',
            dataSource: 'TestDatasource',
        };
        expect(oldConfig).toEqual(config);
        builder = new Builder(config);
        jest.resetAllMocks();
    });

    it('buildTarget', () => {
        const returnValue = builder.buildTarget();

        expect(returnValue).toEqual(new Target(oldConfig.id));
        expect(builder).toEqual({
            config: oldConfig,
        });
    });

    describe('buildView', () => {
        it('with model equal SVM', () => {
            builder.config.model = 'SVM';

            const returnValue = builder.buildView();

            oldConfig.model = 'SVM';
            const expView = new View(oldConfig.type, oldConfig.title, oldConfig.id);
            expView.setDataSource(oldConfig.dataSource);
            expView.setDescription(oldConfig.description);
            expView.setDefaultBackground();
            expect(returnValue).toEqual(expView);
            expect(builder).toEqual({
                config: oldConfig,
            });
        });
    });

    it('with model equal RL', () => {
        builder.config.model = 'RL';

        const returnValue = builder.buildView();

        oldConfig.model = 'RL';
        const expView = new View(oldConfig.type, oldConfig.title, oldConfig.id);
        expView.setDataSource(oldConfig.dataSource);
        expView.setDescription(oldConfig.description);
        expect(returnValue).toEqual(expView);
        expect(builder).toEqual({
            config: oldConfig,
        });
    });
});
