import mongoose, { Schema, Document } from 'mongoose';

// Интерфейс для позиционных и размерных свойств
interface IPositionProps {
  x: number | string;
  y: number | string;
  w: number | string;
  h: number | string;
}

// Интерфейс для базовых текстовых свойств
interface ITextPropsOptions {
  align?: string;
  autoFit?: boolean;
  baseline?: number;
  bold?: boolean;
  breakLine?: boolean;
  bullet?: boolean | object;
  charSpacing?: number;
  color?: string;
  fill?: string;
  fit?: string;
  fontFace?: string;
  fontSize?: number;
  glow?: object;
  highlight?: string;
  hyperlink?: string;
  indentLevel?: number;
  inset?: number;
  isTextBox?: boolean;
  italic?: boolean;
  lang?: string;
  line?: object;
  lineSpacing?: number;
  lineSpacingMultiple?: number;
  margin?: number;
  outline?: object;
  paraSpaceAfter?: number;
  paraSpaceBefore?: number;
  rectRadius?: number;
  rotate?: number;
  rtlMode?: boolean;
  shadow?: object;
  softBreakBefore?: boolean;
  strike?: string;
  subscript?: boolean;
  superscript?: boolean;
  transparency?: number;
  underline?: object;
  valign?: string;
  vert?: string;
  wrap?: boolean;
}

// Интерфейс для элемента слайда
interface IElement {
  type: string;
  text?: string;
  path?: string;
  shapeType?: string;
  options: IPositionProps & ITextPropsOptions;
}

// Интерфейс для слайда
interface ISlide {
  title: string;
  background: {
    color: string;
  };
  elements: IElement[];
}

// Интерфейс для презентации
interface IPresentation extends Document {
  title: string;
  slides: ISlide[];
}

// Схема для опций элемента
const OptionsSchema = new Schema({
  x: { type: Schema.Types.Mixed, required: true },
  y: { type: Schema.Types.Mixed, required: true },
  w: { type: Schema.Types.Mixed, required: true },
  h: { type: Schema.Types.Mixed, required: true },
  align: { type: String },
  autoFit: { type: Boolean },
  baseline: { type: Number },
  bold: { type: Boolean },
  breakLine: { type: Boolean },
  bullet: { type: Schema.Types.Mixed },
  charSpacing: { type: Number },
  color: { type: String },
  fill: { type: String },
  fit: { type: String },
  fontFace: { type: String },
  fontSize: { type: Number },
  glow: { type: Schema.Types.Mixed },
  highlight: { type: String },
  hyperlink: { type: Schema.Types.Mixed },
  indentLevel: { type: Number },
  inset: { type: Number },
  isTextBox: { type: Boolean },
  italic: { type: Boolean },
  lang: { type: String },
  line: { type: Schema.Types.Mixed },
  lineSpacing: { type: Number },
  lineSpacingMultiple: { type: Number },
  margin: { type: Number },
  outline: { type: Schema.Types.Mixed },
  paraSpaceAfter: { type: Number },
  paraSpaceBefore: { type: Number },
  rectRadius: { type: Number },
  rotate: { type: Number },
  rtlMode: { type: Boolean },
  shadow: { type: Schema.Types.Mixed },
  softBreakBefore: { type: Boolean },
  strike: { type: String },
  subscript: { type: Boolean },
  superscript: { type: Boolean },
  transparency: { type: Number },
  underline: { type: Schema.Types.Mixed },
  valign: { type: String },
  vert: { type: String },
  wrap: { type: Boolean }
}, { _id: false });

// Схема для элемента
const ElementSchema = new Schema({
  type: { type: String, required: true },
  text: { type: String },
  path: { type: String },
  shapeType: { type: String },
  options: { type: OptionsSchema, required: true }
}, { _id: false });

// Схема для слайда
const SlideSchema = new Schema({
  title: { type: String, required: true },
  background: {
    color: { type: String, required: true }
  },
  elements: { type: [ElementSchema], required: true }
});

// Схема для презентации
const PresentationSchema = new Schema({
  title: { type: String, required: true },
  slides: { type: [SlideSchema], required: true }
});

const PresentationModel = mongoose.model<IPresentation>('Presentation', PresentationSchema);

export default PresentationModel;
export { ISlide, IPresentation, IElement, IPositionProps, ITextPropsOptions };
