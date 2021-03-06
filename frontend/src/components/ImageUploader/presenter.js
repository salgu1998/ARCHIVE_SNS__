import React from 'react';

import { 
    Form
} from 'react-bootstrap';

const ImageUploader = (props, context) => (
	
	<Form.File 
		id="formcheck-api-regular"
		className="ImgUploaderFrom">

		<div className="ImgPreview">
			{
				props.img_preview.map(elem => (
					<img src={elem} />))
			}
		</div>

		<Form.File.Input
			className = "img_btn"
			type="file"
			// accept='image/jpg, impge/png, image/jpeg, image/gif'
			name="img" 
			value={props.img_value}
			onChange={props.img_change_handler} />
		</Form.File>
	
);

export default ImageUploader;