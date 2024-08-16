import { TextInput, FileInput, Button } from "flowbite-react";
import ReactQuill from "react-quill";
import { modules, formats } from "../utils/quill";
import { useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import "../styles/quill.css";
import CategoryDropdown from "../components/CategoryDropdown";

const CreatePost = () => {
  const theme = useSelector(state => state.theme);

  return (
    <div className="p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput 
            type="text"
            placeholder="Title"
            required
            name="title"
            className="flex-1"
          />
          <CategoryDropdown />
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" name="image" />
          <Button 
            type="button"
            outline
            className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
            size="sm"
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill 
          placeholder="Write something amazing..."
          theme="snow"
          className={`h-96 mb-12 ${theme === "dark" ? "quill-dark" : ""}`}
          modules={modules}
          formats={formats}
          required
        />
        <Button 
          type="submit"
          className="focus:ring-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 mb-5"
          outline
        >
          Publish
        </Button>
      </form>
    </div>
  )

}

export default CreatePost;