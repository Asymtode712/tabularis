import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConnectionErrorBanner } from "../../src/components/ConnectionErrorBanner";

describe("ConnectionErrorBanner", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText },
    });
  });

  it("copies the complete message including collapsed details", async () => {
    const message = "Connection failed\n\nError: TLS certificate detail";
    render(<ConnectionErrorBanner message={message} onClose={vi.fn()} />);

    expect(screen.queryByText("Error: TLS certificate detail")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(message);
    });
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it("names and types the close button", () => {
    render(<ConnectionErrorBanner message="Connection failed" onClose={vi.fn()} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toHaveAttribute("type", "button");
  });
});
