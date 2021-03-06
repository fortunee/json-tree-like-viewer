import { Component } from '@angular/core';
import { DomService } from './services/dom.service';

import source from '../assets/source-object-example.json';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { InputComponent } from './components/input/input.component';
import { ObjectNestComponent } from './components/object-nest/object-nest.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'json-tree-like-viewer';
  source = source;
  step = -1;
  parents = [];

  constructor(private domService: DomService) {
    this.displayData(this.source);
  }

  displayData(data) {
    this.step++;

    // tslint:disable-next-line:forin
    for (const key in data) {
      // Stack DS approach
      const immediate = this.parents.length ? this.parents[this.parents.length - 1] : document.body;
      if (typeof data[key] === 'object' && data[key] !== null) {
        const component = this.returnComponent(data[key]);
        this.parents.push(this.domService.appendComponentToRootElement(component, data[key], key, this.step, immediate));
        this.displayData(data[key]);
      } else {
        const component = this.returnComponent(data[key]);

        this.domService.appendComponentToRootElement(component, data[key], key, this.step, immediate);
      }

      const allKeys = Object.keys(data);

      if (allKeys[allKeys.length - 1] === key) {
        this.step--;
        this.parents.pop();
      }
    }
  }

  returnComponent(value) {
    switch (typeof value) {
      case 'boolean': {
        return CheckBoxComponent;
      }

      case 'object': {
        return ObjectNestComponent;
      }

      case 'string':
      case 'number':
      default: {
        return InputComponent;
      }
    }
  }
}
