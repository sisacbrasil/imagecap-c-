import React, {Component} from "react"
import {Map} from "immutable"
import {Space} from "antd"
import Image from "../Image"

class ImagePicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            picked: Map(),
        }
        this.handleImageClick = this.handleImageClick.bind(this)
        this.renderImage = this.renderImage.bind(this)
    }

    handleImageClick(image) {
        const {multiple, onPick} = this.props
        const pickedImage = multiple ? this.state.picked : Map()
        const newerPickedImage = pickedImage.has(image.value)
            ? pickedImage.delete(image.value)
            : pickedImage.set(image.value, image.src)

        this.setState({picked: newerPickedImage})

        const pickedImageToArray = []
        newerPickedImage.map((img, i) =>
            pickedImageToArray.push({src: img, value: i})
        )

        onPick(multiple ? pickedImageToArray : pickedImageToArray[0])
    }

    renderImage(image, i) {
        return (
            <Image
                src={image.src}
                isSelected={this.state.picked.has(image.value)}
                onImageClick={() => this.handleImageClick(image)}
                key={i}
            />
        )
    }

    render() {
        const {images, inline} = this.props
        return inline ? (
            <Space className="image_picker">{images.map(this.renderImage)}</Space>
        ) : (
            <Space size={[8, 16]} wrap className="image_picker">
                {images.map(this.renderImage)}
            </Space>
        )
    }
}

export default ImagePicker
