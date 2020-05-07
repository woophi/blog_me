import { Quill } from 'react-quill';
const BaseImage = Quill.import('formats/image');

export type ImageValue = {
  url: string;
  format: string;
  alt?: string;
};

export class Image extends BaseImage {
  static create(value: ImageValue) {
    let obj: ImageValue = {
      url: '',
      alt: '',
      format: ''
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

    if (obj.format !== '.gif') {
      obj.format = '.jpg';
    }

    nodeImg.setAttribute('alt', obj.alt ?? 'random image');
    nodeImg.setAttribute('data-src', url + obj.format);
    nodeImg.setAttribute('class', 'lazyload');

    nodeSource.setAttribute('type', 'image/webp');
    nodeSource.setAttribute('data-srcset', url + '.webp');

    nodeParent.appendChild(nodeSource);
    nodeParent.appendChild(nodeImg);

    return nodeParent;
  }

  static value(node: HTMLPictureElement): ImageValue {
    const img = (atr: string) => (node.lastChild as any).getAttribute(atr);
    const url = img('data-src') ?? '';
    const ext = url.split('.').pop();
    return {
      alt: img('alt') ?? 'random image',
      url,
      format: ext ? `.${ext}` : ''
    };
  }

  format(name, value) {}
}

Image.tagName = 'picture';
