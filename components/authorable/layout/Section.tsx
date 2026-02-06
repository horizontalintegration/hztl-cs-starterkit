import { IComponents } from "@/.generated";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { tv } from "tailwind-variants";

export const Section = (props: IComponents['section']) => {

  const { base, wrapper, container, content, title, description, imageWrapper } = TAILWIND_VARIANTS();
  return (
    <div className={base()}>
      <div className={wrapper()}>
        <div className={container()}>
          <ImageWrapper image={props.test_image} wrapperClassName={imageWrapper()} />
          <div className={content()}>
            <h2 className={title()}>
              {props.title}
            </h2>
            <p className={description()}>
              {props.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'w-full',
    ],
    wrapper: [
      'flex',
      'flex-col',
      'justify-center',
      'my-10'
    ],
    container: [
      'w-full',
      'max-w-screen-2xl',
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-5',
      'bg-cyan-300',
      'px-6',
      'md:px-12',
      'lg:px-20',
      'py-10'
    ],
    imageWrapper: [
      'w-full',
    ],
    content: [
      'flex',
      'flex-col',
      'gap-3',
      'justify-center',
    ],
    title: [
      'text-4xl',
      'font-bold',
    ],
    description: [
      'text-lg',
      'text-gray-600',
    ]
  }
})