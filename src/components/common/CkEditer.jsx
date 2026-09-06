// src/components/CKEditor.jsx
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CustomCKEditor = ({ value, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList']
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default CustomCKEditor;