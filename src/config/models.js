import { ResultModel } from '@eeacms/search';
const path = require('path');

export class DatahubResultModel extends ResultModel {
  get href() {
    if (__CLIENT__) {
      return path.join(
        window.location.pathname,
        'datahubitem-view/',
        this._result.about?.raw,
      );
    } else {
      return ''; //TODO
    }
  }

  get daysSinceIssued() {
    return super.daysSinceIssued;
  }

  get id() {
    return super.id;
  }

  get isNew() {
    return super.isNew;
  }

  get issued() {
    return super.issued;
  }

  get expires() {
    return super.expires;
  }

  get isExpired() {
    return super.isExpired;
  }

  get metaCategories() {
    return super.metaCategories;
  }

  get clusterIcon() {
    return super.clusterIcon;
  }

  get clusterInfo() {
    return super.clusterInfo;
  }

  get clusterName() {
    return super.clusterName;
  }

  get source() {
    return super.source;
  }

  get title() {
    return super.title;
  }

  get description() {
    return super.description;
  }

  get hasImage() {
    return super.hasImage;
  }

  get thumbUrl() {
    return super.thumbUrl;
  }

  get highlight() {
    return super.highlight;
  }

  get website() {
    return super.website.website;
  }

  get tags() {
    return super.tags;
  }

  get metaTypes() {
    return super.metaTypes;
  }

  get explanation() {
    return super.explanation;
  }
}
