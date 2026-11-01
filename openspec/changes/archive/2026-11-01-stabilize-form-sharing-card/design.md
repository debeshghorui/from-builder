# Design

## Context

See `proposal.md` for the layout shift and QR styling motivation. The current builder conditionally mounts `FormSharingCard` after `PageHeading`; publishing invalidates the form query, which adds or removes that block. The QR is drawn from the `qrcode` matrix in a client component and can be styled without changing the encoder or public URL.

## Goals / Non-Goals

**Goals:**

- Keep the builder's top section stable when `form.published` changes.
- Keep the share card visible and disabled for unpublished forms.
- Make the published QR feel native to the warm, dark-first app while retaining high contrast and a scannable structure.

**Non-Goals:**

- Change the public route, QR payload, password behavior, or response settings.
- Add a new QR service or replace the existing encoder.
- Pin the card during page scroll.

## Decisions

- Build the builder's top section as a desktop two-column layout: title and publish controls on the left, the share card in a fixed-width right column. Stack these regions in the same order on narrow screens.
- Always render the card slot. Pass the published state to the card; the draft state keeps the same outer size and shows a subdued lock/message with copy and download controls disabled or absent. The published state fills that reserved area with the QR and actions.
- Retain the current QR payload generation and canvas export. Style data modules as round dots, draw the three finder markers as softened concentric rounded squares, and use a warm near-black ink on a warm off-white tile with a four-module quiet zone. The preview and PNG continue to use the same generated image.
- Keep the card's minimum block size stable between states. At narrow widths let it use available width and flow beneath the builder header without horizontal scrolling.

## Risks / Trade-offs

- [Rounded finder markers reduce scan robustness] → Keep recognizable concentric finder geometry, strong contrast, and the existing quiet zone; verify the exported image decodes to the public URL.
- [A reserved card occupies space for drafts] → Use the same compact card footprint for the explanatory placeholder, so owners understand the feature and the layout remains stable.

## Migration Plan

No data, API, or dependency migration is required. Revert the builder layout and card-state changes to roll back.
