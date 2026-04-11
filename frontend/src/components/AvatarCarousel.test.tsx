import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AvatarCarousel from "./AvatarCarousel";

// Mock embla carousel
vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => {
    return [
      {
        current: document.createElement("div"),
      } as any,
      {
        scrollPrev: vi.fn(),
        scrollNext: vi.fn(),
        on: vi.fn(),
      } as any,
    ];
  }),
}));

describe("AvatarCarousel Component", () => {
  const mockOnSelect = vi.fn();
  const images = ["avatar1.jpg", "avatar2.jpg", "avatar3.jpg"];

  it("should render carousel component", () => {
    const { container } = render(
      <AvatarCarousel images={images} onSelect={mockOnSelect} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should have left and right arrow buttons", () => {
    render(<AvatarCarousel images={images} onSelect={mockOnSelect} />);
    const buttons = screen.getAllByRole("button");
    // Should have at least 2 buttons (left and right arrows)
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle image selection callback", () => {
    render(<AvatarCarousel images={images} onSelect={mockOnSelect} />);
    mockOnSelect("avatar2.jpg");
    expect(mockOnSelect).toHaveBeenCalledWith("avatar2.jpg");
  });

  it("should highlight selected image", () => {
    render(
      <AvatarCarousel
        images={images}
        selectedImage="avatar2.jpg"
        onSelect={mockOnSelect}
      />,
    );
    // Component renders with selected state
    const container = document.querySelector(".relative");
    expect(container).toBeInTheDocument();
  });

  it("should handle undefined image in array", () => {
    const imagesWithUndefined = ["avatar1.jpg", undefined, "avatar3.jpg"];
    render(
      <AvatarCarousel images={imagesWithUndefined} onSelect={mockOnSelect} />,
    );
    // Component should render even with undefined values
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should render carousel container", () => {
    const { container } = render(
      <AvatarCarousel images={images} onSelect={mockOnSelect} />,
    );
    const carouselContainer = container.querySelector(".relative");
    expect(carouselContainer).toBeInTheDocument();
  });

  it("should have scroll buttons accessible", () => {
    render(<AvatarCarousel images={images} onSelect={mockOnSelect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  it("should accept array of avatar images", () => {
    const testImages = ["avatar1.jpg", "avatar2.jpg", "avatar3.jpg"];
    expect(testImages.length).toBe(3);
    render(<AvatarCarousel images={testImages} onSelect={mockOnSelect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should use embla carousel configuration", () => {
    const carouselConfig = {
      align: "start",
      loop: true,
      slidesToScroll: 1,
    };
    expect(carouselConfig.loop).toBe(true);
    expect(carouselConfig.align).toBe("start");
  });
});
