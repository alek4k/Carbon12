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
import View, { setDataSourceMock, setDescriptionMock, setDefaultBackgroundMock }
    from '../../../src/utils/view';

jest.mock('../../../src/utils/target');
jest.mock('../../../src/utils/view');

it('Testing constructor', () => {
    const parConfig = {
        id: 0,
        type: 'Grafico',
        title: 'TestBuilder',
        description: 'TestBuilderDescription',
        model: 'SVM',
        dataSource: 'TestDatasource',
    };
    const builder = new Builder(parConfig);

    expect(builder).toEqual({
        config: {
            id: 0,
            type: 'Grafico',
            title: 'TestBuilder',
            description: 'TestBuilderDescription',
            model: 'SVM',
            dataSource: 'TestDatasource',
        },
    });
});

describe('Testing method', () => {
    let builder = null;
    beforeEach(() => {
        builder = new (function testBuilder() { })();
        jest.clearAllMocks();
    });

    it('buildTarget', () => {
        builder.buildTarget = Builder.prototype.buildTarget;
        builder.config = {
            id: 0,
        };

        const returnValue = builder.buildTarget();

        expect(Target).toHaveBeenCalledTimes(1);
        expect(Target).toHaveBeenCalledWith(0);
        expect(returnValue).toEqual(new Target());
        expect(builder).toEqual({
            buildTarget: Builder.prototype.buildTarget,
            config: {
                id: 0,
            },
        });
    });

    describe('buildView', () => {
        it('with model equal SVM', () => {
            builder.buildView = Builder.prototype.buildView;
            builder.config = {
                id: 0,
                type: 'Grafico',
                title: 'TestBuilder',
                description: 'TestBuilderDescription',
                model: 'SVM',
                dataSource: 'TestDatasource',
            };

            const returnValue = builder.buildView();

            expect(View).toHaveBeenCalledTimes(1);
            expect(View).toHaveBeenCalledWith('Grafico', 'TestBuilder', 0);
            expect(returnValue).toEqual(new View());
            expect(setDataSourceMock).toHaveBeenCalledTimes(1);
            expect(setDataSourceMock).toHaveBeenCalledWith('TestDatasource');
            expect(setDescriptionMock).toHaveBeenCalledTimes(1);
            expect(setDescriptionMock).toHaveBeenCalledWith('TestBuilderDescription');
            expect(setDefaultBackgroundMock).toHaveBeenCalledTimes(1);
            expect(setDefaultBackgroundMock).toHaveBeenCalledWith();
            expect(builder).toEqual({
                buildView: Builder.prototype.buildView,
                config: {
                    id: 0,
                    type: 'Grafico',
                    title: 'TestBuilder',
                    description: 'TestBuilderDescription',
                    model: 'SVM',
                    dataSource: 'TestDatasource',
                },
            });
        });
    });

    it('with model equal SVM', () => {
        builder.buildView = Builder.prototype.buildView;
        builder.config = {
            id: 0,
            type: 'Grafico',
            title: 'TestBuilder',
            description: 'TestBuilderDescription',
            model: 'RL',
            dataSource: 'TestDatasource',
        };

        const returnValue = builder.buildView();

        expect(View).toHaveBeenCalledTimes(1);
        expect(View).toHaveBeenCalledWith('Grafico', 'TestBuilder', 0);
        expect(returnValue).toEqual(new View());
        expect(setDataSourceMock).toHaveBeenCalledTimes(1);
        expect(setDataSourceMock).toHaveBeenCalledWith('TestDatasource');
        expect(setDescriptionMock).toHaveBeenCalledTimes(1);
        expect(setDescriptionMock).toHaveBeenCalledWith('TestBuilderDescription');
        expect(setDefaultBackgroundMock).toHaveBeenCalledTimes(0);
        expect(builder).toEqual({
            buildView: Builder.prototype.buildView,
            config: {
                id: 0,
                type: 'Grafico',
                title: 'TestBuilder',
                description: 'TestBuilderDescription',
                model: 'RL',
                dataSource: 'TestDatasource',
            },
        });
    });
});
