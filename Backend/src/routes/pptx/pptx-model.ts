enum ELEMENT_TYPES {
    IMAGE,
    SHAPE,
    TEXT
}

type PresentationElement = {
    type: ELEMENT_TYPES,
    x1: number, // top left corner point x
    y1: number, // top left corner point y
    x2: number, // bottom right corner point x
    y2: number, // bottom right corner point y
    opacity: number,
    // Additional properties for IMAGE type
    src?: string, // URL of the image
    alt?: string, // Alternative text for the image
    // Additional properties for SHAPE type
    shapeType?: 'rectangle' | 'circle' | 'triangle', // Type of shape
    fillColor?: string, // Fill color of the shape
    borderColor?: string, // Border color of the shape
    borderWidth?: number, // Border width of the shape
    // Additional properties for TEXT type
    textContent?: string, // Text content
    fontFamily?: string, // Font family
    fontSize?: number, // Font size
    fontWeight?: 'normal' | 'bold', // Font weight
    fontColor?: string, // Font color
    textAlign?: 'left' | 'center' | 'right', // Text alignment
    lineHeight?: number // Line height
}

type Slide = {
    elements: PresentationElement[]
}

type Presentation = {
    fileName: string,
    createdAt: Date,
    updatedAt: Date,
    slides: Slide[]
}
