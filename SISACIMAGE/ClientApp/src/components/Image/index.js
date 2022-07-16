import React from "react"

const ImageStyle = (width, height) => ({
    width,
    height,
    objectFit: "cover",
})

const Image = ({src, isSelected, onImageClick, alt}) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
        className={`responsive${isSelected ? " selected" : ""}`}
        onClick={onImageClick}
    >
        <img
            src={src}
            className={`thumbnail${isSelected ? " selected" : ""}`}
            style={ImageStyle(200, 200)}
            alt={alt}
        />
        <div className="checked">
            <div className="icon"/>
        </div>
    </div>
)

export default Image
