import { Quill } from 'react-quill';
const BaseImage = Quill.import('formats/image');

export class Image extends BaseImage {
  static create(value) {
    let obj = {
      url: '',
      alt: '',
    };
    if (typeof value === 'string') {
      obj.url = value;
    } else {
      obj = value;
    }
    const nodeImg = document.createElement('img');
    const nodeParent = document.createElement('picture');
    const nodeSource = document.createElement('source');

    let url = obj.url;
    const ext = url.split('.').pop();
    if (ext) {
      url = url.substring(0, url.indexOf('.' + ext));
    }

    nodeImg.setAttribute('alt', obj.alt ?? 'random image');
    nodeImg.setAttribute('data-src', url + '.jpg');
    nodeImg.setAttribute('class', 'lazyload');

    nodeSource.setAttribute('type', 'image/webp');
    nodeSource.setAttribute('data-srcset', url + '.webp');

    nodeParent.appendChild(nodeSource);
    nodeParent.appendChild(nodeImg);

    return nodeParent;
  }

  static value(node: HTMLPictureElement) {
    const img = (atr: string) => (node.lastChild as any).getAttribute(atr);
    return {
      alt: img('alt') ?? 'random image',
      url: img('data-src'),
    };
  }

  format(name, value) {}
}

Image.tagName = 'picture';
