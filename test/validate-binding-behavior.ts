import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { TriggerForm } from './resources/trigger-form';
import { configure, blur, change } from './shared';

describe('ValidateBindingBehavior', () => {
  it('sets validateTrigger', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<trigger-form></trigger-form>')
      .boundTo({});
    component.bootstrap(configure);

    let viewModel: TriggerForm;

    let renderer = { render: jasmine.createSpy() };

    (<Promise<any>>component.create(<any>bootstrap))
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;
        viewModel.controller.addRenderer(renderer);
      })
      // standard validate binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => blur(viewModel.standardInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(viewModel.standardInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => blur(viewModel.standardInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // validateOnBlur binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => blur(viewModel.blurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(viewModel.blurInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => blur(viewModel.blurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // validateOnChange binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => blur(viewModel.changeInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(viewModel.changeInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(viewModel.changeInput, ''))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(viewModel.changeInput, 'test2'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // validateOnChangeOrBlur binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => blur(viewModel.changeOrBlurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(viewModel.changeOrBlurInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(viewModel.changeOrBlurInput, ''))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(viewModel.changeOrBlurInput, 'test2'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // validateManually binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => blur(viewModel.blurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(viewModel.blurInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(viewModel.blurInput, ''))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // cleanup and finish.
      .then(() => component.dispose())
      .then(done);
  });
});
