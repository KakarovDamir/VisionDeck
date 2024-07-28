import mongoose, { Schema, Document } from 'mongoose';

// Интерфейс для элемента слайда
interface IElement {
  type: string;
  text?: string;
  path?: string;
  shapeType?: string;
}

// Интерфейс для слайда
interface ISlide {
  title: string;
  background: {
    transition: string;
    theme: string;
  };
  elements: IElement[];
}

// Интерфейс для презентации
interface IPresentation extends Document {
  title: string;
  slides: ISlide[];
}

// Схема для элемента
const ElementSchema = new Schema({
  type: { type: String, required: true },
  text: { type: String },
  path: { type: String },
  shapeType: { type: String }
}, { _id: false });

// Схема для слайда
const SlideSchema = new Schema({
  title: { type: String, required: true },
  background: {
    transition: { type: String },
    theme: { type: String }
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
export { ISlide, IPresentation, IElement };
