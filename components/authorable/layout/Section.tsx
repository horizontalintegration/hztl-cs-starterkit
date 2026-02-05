import { IComponents } from "@/.generated";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";

export const Section = (props: IComponents['section']) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full h-full">
          <ImageWrapper image={props.test_image_field} sizes="(max-width: 768px) 100vw, 50vw" fetchPriority="high" loading="eager"></ImageWrapper>
        </div>
        <div className="w-full h-full">
          <h2>Section</h2>
          <h3 {...getCSLPAttributes(props.$?.title)}>{props.title}</h3>
          <p {...getCSLPAttributes(props.$?.description)}>{props.description}</p>
        </div>
      </div>
    </div>
  )
}
