import { IsNotEmpty, Length, IsEmail } from "class-validator";
import { Image, PostImage } from "../Entities/Image";
import sanitizeHtml from 'sanitize-html';

export class ImageDTO {
	@IsNotEmpty()
	url: string;

	public toEntity(): Image {
		const { url } = this;

		const newImage = new Image;
		newImage.url = sanitizeHtml(url);

		return newImage;
	}

	public updateEntity(target) {
		const { url } = this;

		target.entity.url = sanitizeHtml(url);
	}

	public fromJson(json) {
		const { url } = json

		this.url = sanitizeHtml(url);
	}
}
