{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  name = "nodejs";
  buildInputs = with pkgs; [
    pkgs.libuuid
    nodejs_18
  ];
  env = { LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];  }; 
}

