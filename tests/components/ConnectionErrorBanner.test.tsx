import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    await userEvent.click(screen.getByRole("button", { name: "common.copyError" }));

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

  it("exposes the details toggle state", async () => {
    const user = userEvent.setup();
    render(
      <ConnectionErrorBanner
        message={"Connection failed\n\nError: TLS certificate detail"}
        onClose={vi.fn()}
      />,
    );

    const detailsButton = screen.getByRole("button", {
      name: "common.showDetails",
    });
    expect(detailsButton).toHaveAttribute("aria-expanded", "false");

    await user.click(detailsButton);
    expect(detailsButton).toHaveAttribute("aria-expanded", "true");
  });
});
