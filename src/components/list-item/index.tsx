import { Component, h } from 'preact';

import * as mitt from 'mitt';

import './style.scss';

export type Side = 'left' | 'right';

interface ListItemProps {
  onAction?: (action: string, index: number) => void;
  index: number;
  text: string;
  key: string;
}

export default class ListItem extends Component<ListItemProps, {}> {
  
  private mitty: any = mitt();

  private startX: number;
  private left: boolean;
  private right: boolean;

  public componentDidMount() {
    this.base.addEventListener('touchstart', this.started);
    this.base.addEventListener('touchmove', this.moving);
    this.base.addEventListener('touchend', this.end);
    this.mitty.on('sde-action', this.onAction);
  }

  public componentWillUnmount() {
    this.base.removeEventListener('touchstart', this.started);
    this.base.removeEventListener('touchmove', this.moving);
    this.base.removeEventListener('touchend', this.end);
    this.mitty.off('sde-action', this.onAction);    
  }

  public render({ index, text }: { index: number, text: string }) {
    return (
      <div class="sde-container">
        <Underground ee={this.mitty} side={'left'} containerWidth={400}></Underground>
        <Overground ee={this.mitty} text={text}></Overground>
        <Underground ee={this.mitty} side={'right'} containerWidth={400}></Underground>
      </div>
    );
  }

  private onAction = (action: string) => {
    if (this.props.onAction) {
      this.props.onAction(action, this.props.index);
    }
  }

  private started = (e: TouchEvent) => {
    this.startX = e.touches[0].clientX;
  }

  private moving = (e: TouchEvent) => {
    if (this.right) {
      this.mitty.emit('sde-moving-right', { x: this.startX, e });
      return;    
    }

    if (this.left) {
      this.mitty.emit('sde-moving-left', { x: this.startX, e });
      return;     
    }

    this.right = this.startX > e.touches[0].clientX;
    this.left = !this.right;
  }

  private end = (e: TouchEvent) => {
    this.left = false;
    this.right = false;
    this.mitty.emit('sde-end');    
  }
}

export class Overground extends Component<{ ee: any, text: string }, {}> {

  public componentDidMount() {
    this.props.ee.on('sde-action', this.actionReceived);
  }

  public componentWillUnmount() {
    this.props.ee.off('sde-action', this.actionReceived);
  }

  public render({ ee, text }: { ee: any, text: string }) {
    return (
        <div class="sde-content">{text}</div>
    );
  }

  private actionReceived = (action: string) => {
    this.base.style.width = '0px';
  }
}

interface UndergroundProps {
  ee: any;
  side: Side;
  containerWidth: number;
}

export class Underground extends Component<UndergroundProps, {}> {

  private lastWidth: number;

  public componentDidMount() {
    this.props.ee.on('sde-moving-' + this.props.side, this.moving);
    this.props.ee.on('sde-end', this.end);
  }

  public componentWillUnmount() {
    this.props.ee.off('sde-moving-' + this.props.side, this.moving);
    this.props.ee.off('sde-end', this.end);
  }

  public render({ ee, side, containerWidth }: UndergroundProps, {}) {
    return (
      <div class={'sde-' + side}></div>
    );
  }

  private moving = ({ x, e }: { x: number, e: TouchEvent }) => {
    this.lastWidth = this.props.side === 'left' ?
      (e.touches[0].clientX - x) :
      (x - e.touches[0].clientX);
    this.base.style.width = Math.round(this.lastWidth) + 'px';
  }

  private end = () => {
    if (this.lastWidth > this.props.containerWidth) {
      this.base.style.width = this.props.containerWidth + 'px';
      this.props.ee.emit('sde-action', this.props.side);
    } else {
      this.base.style.width = '0px';
    }
  }
}
