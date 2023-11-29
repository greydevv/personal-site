import "server-only";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import { PageProps } from "src/types";
import BlogTags from "src/app/blog/components/BlogTags";
import BlogBody from "src/app/blog/[slug]/components/BlogBody";
import client from "src/apollo";
import { formatDate } from "src/util";

export default async function BlogPost(props: PageProps) {
  const blog: BlogPost | null = await getData(props.params.slug);
  if (!blog) {
    return notFound();
  }

  return (
    <div className="mb-8 sm:mb-16">
      <div className="mb-4 sm:mb-10 bg-red-10 pb-4 pt-10 sm:py-10">
        <div className="max-w-[700px] mx-auto px-4">
          <Link href="/blog">
            <Image
              src="/icons/back_arrow.svg"
              alt="Back arrow"
              height="13"
              width="26"
            />
          </Link>
          <div className="mb-4 mt-4">
            <h1 className="text-4xl sm:text-5xl font-semibold">
              { blog.title }
            </h1>
            <p className="attribute text-red">
              { formatDate(blog.date) }
            </p>
          </div>
          <BlogTags tags={ blog.tags } />
        </div>
      </div>
      <div className="max-w-[700px] mx-auto px-4">
        <BlogBody rawMarkdown={ blog.body }/>
        <div className="relative h-16 sm:h-20 aspect-[20/9] mx-auto mt-10 sm:mt-20">
          <Image
            src="/signature.svg"
            alt=""
            fill
          />
        </div>
      </div>
    </div>
  );
}

interface BlogPost {
  readonly title: string
  readonly body: string
  readonly date: Date
  readonly tags: string[]
}

async function getData(slug: string): Promise<BlogPost | null> {
  const BLOG_POST_QUERY = gql`
    query ($slug: String!, $public: Boolean!)  {
      blog (query: { slug: $slug, public: $public } ) {
        _id
        title
        body
        date
        public
        tags
      }
    }
  `;
  const { error, data } = await client.query({
    query: BLOG_POST_QUERY,
    variables: {
      slug: slug,
      public: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.blog || !data.blog.public) {
    return null;
  }

  return {
    ...data.blog,
    body: getBlogBody().join("  \n")
    // body: data.blog.body.replace(/\\n/g, "  \n")
  };
}

function getBlogBody() {
  return [
    "### A Biological Analogy",
    "A perceptron is a fundamental building block of neural networks. Interestingly, it can be thought of as a mathematical model of a biological neuron:",
    "![A side-by-side comparison of a biological neuron and a perceptron.](what-is-a-perceptron/neuron_analogy.png)",
    "The relationship is quite clear: information is received, processed, and an output is produced.",
    "### But Actually, What is It?",
    "Realizing the relationship between a perceptron and a biological neuron doesn't do us much good from a mathematical standpoint. Let's begin by updating our perceptron with some critical variables, $w$ and $b$.",
    "![A perceptron with input, weight, bias, and output.](what-is-a-perceptron/perceptron_incomplete.png)",
    "Every input to the perceptron has an associated weight, denoted by $w$. The perceptron itself is associated with a bias, $b$. Let's apply these variables to something you learned in math class all those years ago:",
    "$$",
    "y = wx+b",
    "$$",
    "That's a line equation - look at you go! However, we're still missing something important. If you've read about neural networks before, you've probably heard of something called the *activation function*. Let's denote this as $f$:",
    "![A perceptron with input, weight, bias, activation function, and output.](what-is-a-perceptron/perceptron_complete.png)",
    "We can take our previous line equation and put it through the activation function, yielding:",
    "$$",
    "y = f(wx + b)",
    "$$",
    "But... what's the point? Let's see an example of how the activation function would help us in this simple model.",
    // "But... what's the point? Let's say we're training a model to recognize whether a fruit is an apple or watermelon based on its weight. If $y=wx+b=36.27$, does the perceptron think it's an apple or watermelon?",
    // "What if we were able to squish $36.27$ into a value between $0$ and $1$? We could then choose *apple* if the value is closer to $0$ and *watermelon* if the value is closer to $1$! This makes the decision process much easier - let's further this example by introducing a popular activation function.",
    "### The Sigmoid Function",
    "$$",
    "\\sigma(z)=\\frac{1}{1+e^{-z}}",
    "$$",
    "The purpose of the sigmoid function is to take an input, $z$, and squash it to a decimal value between $0$ and $1$.",
    "![A graph of the sigmoid curve.](what-is-a-perceptron/sigmoid_curve.png)",
    "The output can be viewed as a probability. We can use this probability to determine whether or not the input belongs to class $-1$ or class $1$ using a *decision boundary*. If we use $0.5$ as a decision boundary and $y\\lt0.5$, then we classify the input as a $-1$. If $y\\ge0.5$, we'd classify the input as a $1$.",
    "Let's say we're deciding if a fruit is an apple ($-1$) or a watermelon ($1$) based on its mass in grams. After applying the perceptron's weight and bias to the fruit's mass of $73\\text{g}$, we end up with:",
    "$$",
    "y = \\sigma(w\\cdot73 + b)",
    "$$",
    "If the result is $0.13$ and our decision boundary is $0.5$, we'd classify the input as $-1$ (apple). On the other hand, if the result is $0.74$, we'd classify the input as $1$ (watermelon).",
    "### A Big Problem",
    "All this time, we've been operating under the assumption there is only one feature in $x$. This is fine for our apple vs. watermelon example; however, most problems have more than one feature.",
    "For example, let's say we're trying to recommend apartments to renters based on square footage and number of bedrooms. This means we now have *two* features - you guessed it - square footage and number of bedrooms. Let's call square footage $x_0$ and number of bedrooms $x_1$. Instead of just a single number, our input $x$ is now a matrix:",
    "$$",
    "x=",
    "\\begin{bmatrix}",
    "x_0 & x_1",
    "\\end{bmatrix}",
    "$$",
    "### Handling Multiple Features",
    "Now that we have multiple features, we need multiple weights. Remember, each input is associated with its own weight. Let's update our perceptron with $w_0$ and $w_1$:",
    "![A perceptron with multiple inputs and their corresponding weights.](what-is-a-perceptron/multi_features.png)",
    "And now for our formulas:",
    "$$",
    "\\begin{gathered}",
    "x=",
    "\\begin{bmatrix}",
    "x_0 & x_1",
    "\\end{bmatrix} \\\\",
    "w=",
    "\\begin{bmatrix}",
    "w_0 & w_1",
    "\\end{bmatrix} \\\\",
    "y = f(w^T\\cdot x + b)= f(w_0x_0 + w_1x_1 + b)",
    "\\end{gathered}",
    "$$",
    "Instead of multiplying the inputs and weights, we take the dot product of the transposed weight matrix and the input matrix as we're now dealing with matrices instead of scalars. After simplifying, we get:",
    "$$\ny = f(w_0x_0 + w_1x_1 + b)\n$$",
    "### Learning",
    "Of course, in the beginning, we won't get great results. In our apple vs. watermelon example, the perceptron may very well start out by deciding a fruit weighing $9000\\text{g}$ is an apple and a fruit weighing $76\\text{g}$ is a watermelon.",
    "The perceptron \"learns\" by tuning the weights and biases through a process called *gradient descent*. Gradient descent aims to minimize the error, or loss function.",
    "For example, imagine you have a temperature gauge and you are trying to find the most comfortable temperature for your home. The following image illustrates process you'd carry out:",
    "![Four temperature gauges depicting an analogy of gradient descent.](what-is-a-perceptron/gradient_descent_analogy.png)",
    "It started off too hot, so you try turning it down. It's more comfortable than before, but it's still too hot. You try to take a bigger step, but overshot - it's too cold. Tuning the gauge once more, you finally land on the most comfortable temperature. This is an oversimplified example of how weights and biases are tuned in gradient descent." ,
    "### Wrapping Up",
  ];
}
